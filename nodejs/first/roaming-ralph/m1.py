#!/usr/bin/env python
# git test
from asyncio import Task
import datetime
import queue
from direct.showbase.ShowBase import ShowBase
from panda3d.core import CollisionTraverser, CollisionNode, CollisionHandlerPusher
from panda3d.core import CollisionHandlerQueue, CollisionRay, CollisionSphere, CollisionBox
from panda3d.core import Filename, AmbientLight, DirectionalLight, Quat
from panda3d.core import PandaNode, NodePath, Camera, TextNode
from panda3d.core import CollideMask, CollisionHandlerFloor

#from panda3d.core import *
from direct.gui.OnscreenText import OnscreenText
from direct.actor.Actor import Actor
import random
import sys
import os
import math
import socket
from dataclasses import dataclass, asdict
import threading
import json
import random
global P_NO, E_NO, IP_MASA, IP_PAPA, IP_MAMA, PORT_2222, PORT_2223, IP_PORT
global base, loader, render, taskMgr, globalClock, g_enemy_ralph
global g_enemy_bullet_on, g_enemy_bullet, g_item, g_item_alive, g_item_get, g_item_recv
P_NO = 0
G_ITEM_MAX = 30

# 通信データクラス
@dataclass
class CommData:
    t: str      # M:移動 B:弾発射
    x: float
    y: float
    h: float
    z: float
    l: int
    r: int
    f: int
    s: int
    i: list

E_NO = 1 if P_NO == 0 else 0
IP_MASA = '100.115.92.195'
IP_PAPA = '192.168.0.25'
IP_MAMA = '192.168.0.31'
PORT_2222 = 2222
PORT_2223 = 2223
TYPE_MOVE = 'M'
TYPE_BULLET = 'B'
I_TRUE = 1
I_FALSE = 0

# for git commit test ! 
#IP_PORT = [(IP_MASA, PORT_2222), (IP_MAMA, PORT_2222)]
IP_PORT = [(IP_MASA, PORT_2222), (IP_MASA, PORT_2223)]

g_enemy_ralph = Actor("models/ralph",
                    {"run": "models/ralph-run",
                    "walk": "models/ralph-walk"})

g_enemy_bullet_on = False
g_enemy_bullet: any
g_your_point = 0
g_enemy_point = 0

g_item = []
g_item_alive = []
g_item_recv = []

ITEM_GET_WAIT = "item get wait"
ITEM_GET_GET = "item get get"
ITEM_GET_DONE = "item get done"
g_item_get = ITEM_GET_WAIT

class RoamingRalphDemo(ShowBase):
    def __init__(self, q):
        global g_enemy_bullet, g_item, g_item_alive, g_item_get
        self.q = q
        # Set up the window, camera, etc.
        ShowBase.__init__(self)

        # Set the background color to black
        self.win.setClearColor((0, 0, 0, 1))

        # This is used to store which keys are currently pressed.
        self.keyMap = {
            "left": 0, "right": 0, "forward": 0, "cam-left": 0, "cam-right": 0, "space": 0}

        self.score = 0
        self.scoreUI = OnscreenText(style=1, fg=(1, 1, 1, 1), scale=0.1,
                                    mayChange=True,
                                    shadow=(0, 0, 0, 1), parent=base.a2dTopLeft,
                                    pos=(0.01, -0.1), align=TextNode.ALeft)
        # Set up the environment
        #
        # This environment model contains collision meshes.  If you look
        # in the egg file, you will see the following:
        #
        #    <Collide> { Polyset keep descend }
        #
        # This tag causes the following mesh to be converted to a collision
        # mesh -- a mesh which is optimized for collision, not rendering.
        # It also keeps the original mesh, so there are now two copies ---
        # one optimized for rendering, one for collisions.

        self.environ = loader.loadModel("models/world")
        self.environ.reparentTo(render)
        
        # Create the main character, Ralph

        ralphStartPos = self.environ.find("**/start_point").getPos()
        self.ralph = Actor("models/ralph",
                           {"run": "models/ralph-run",
                            "walk": "models/ralph-walk"})
        
        self.ralph.reparentTo(render)
        self.ralph.setScale(.2)
        self.ralph.setPos(ralphStartPos + (0, 0, 0.0))

        g_enemy_ralph.reparentTo(render)
        g_enemy_ralph.setScale(.2)
        g_enemy_ralph.setPos(ralphStartPos + (0, -5, 0.0))

        # Create a floater object, which floats 2 units above ralph.  We
        # use this as a target for the camera to look at.
        self.floater = NodePath(PandaNode("floater"))
        self.floater.reparentTo(self.ralph)
        self.floater.setZ(2.0)

        # Accept the control keys for movement and rotation

        self.accept("escape", sys.exit)
        self.accept("arrow_left", self.setKey, ["left", True])
        self.accept("arrow_right", self.setKey, ["right", True])
        self.accept("arrow_up", self.setKey, ["forward", True])
        self.accept("a", self.setKey, ["cam-left", True])
        self.accept("s", self.setKey, ["cam-right", True])
        self.accept("arrow_left-up", self.setKey, ["left", False])
        self.accept("arrow_right-up", self.setKey, ["right", False])
        self.accept("arrow_up-up", self.setKey, ["forward", False])
        self.accept("a-up", self.setKey, ["cam-left", False])
        self.accept("s-up", self.setKey, ["cam-right", False])
        self.accept("space", self.setKey, ["space", True])
        self.accept("space-up", self.setKey, ["space", False])

        taskMgr.add(self.move, "moveTask")
        taskMgr.add(self.c2s, "c2sTask")

        # Game state variables
        self.isMoving = False

        # Set up the camera
        self.disableMouse()
        self.camera.setPos(self.ralph.getX(), self.ralph.getY() + 10, 2)

        # We will detect the height of the terrain by creating a collision
        # ray and casting it downward toward the terrain.  One ray will
        # start above ralph's head, and the other will start above the camera.
        # A ray may hit the terrain, or it may hit a rock or a tree.  If it
        # hits the terrain, we can detect the height.  If it hits anything
        # else, we rule that the move is illegal.
        self.cTrav = CollisionTraverser()

        self.ralphGroundCol = CollisionNode('ralphCol')
        self.ralphGroundCol.addSolid(CollisionBox(0, 1, 1, 1))
        self.ralphGroundCol.setFromCollideMask(CollideMask.bit(0))
        self.ralphGroundCol.setIntoCollideMask(CollideMask.allOff())
        self.ralphGroundColNp = self.ralph.attachNewNode(self.ralphGroundCol)
        self.ralphGroundHandler = CollisionHandlerQueue()
        self.cTrav.addCollider(self.ralphGroundColNp, self.ralphGroundHandler)

        self.camGroundRay = CollisionRay()
        self.camGroundRay.setOrigin(0, 0, 10)
        self.camGroundRay.setDirection(0, 0, -1)
        self.camGroundCol = CollisionNode('camRay')
        self.camGroundCol.addSolid(self.camGroundRay)
        self.camGroundCol.setFromCollideMask(CollideMask.bit(0))
        self.camGroundCol.setIntoCollideMask(CollideMask.allOff())
        self.camGroundColNp = self.camera.attachNewNode(self.camGroundCol)
        self.camGroundHandler = CollisionHandlerQueue()
        self.cTrav.addCollider(self.camGroundColNp, self.camGroundHandler)

        # enemy collision
        c = CollisionNode("enemyNode")
        c.addSolid(CollisionBox(0.0, 1, 1, 1))
        self.enemy_c = g_enemy_ralph.attachNewNode(c)
        self.enemyHandler = CollisionHandlerQueue()
        self.cTrav.addCollider(self.enemy_c, self.enemyHandler)

        self.bullet = self.loader.loadModel("models/ball")
        self.bullet.reparentTo(render)
        self.bullet.setScale(0.8)

        self.bulletGroundCol = CollisionNode('bulletCol')
        self.bulletGroundCol.addSolid(CollisionBox(0.0, 1, 1, 1))
        self.bulletGroundCol.setFromCollideMask(CollideMask.bit(0))
        self.bulletGroundCol.setIntoCollideMask(CollideMask.allOff())
        self.bulletGroundColNp = self.bullet.attachNewNode(self.bulletGroundCol)
        self.bulletGroundHandler = CollisionHandlerQueue()
        self.cTrav.addCollider(self.bulletGroundColNp, self.bulletGroundHandler)

        g_enemy_bullet = self.loader.loadModel("models/ball")
        g_enemy_bullet.reparentTo(render)
        g_enemy_bullet.setScale(0.8)

        # Uncomment this line to see the collision rays
        #self.ralphGroundColNp.show()
        #self.camGroundColNp.show()

        # Uncomment this line to show a visual representation of the
        #self.cTrav.showCollisions(render)

        # Create some lighting
        ambientLight = AmbientLight("ambientLight")
        ambientLight.setColor((.6, .6, .6, 1))
        directionalLight = DirectionalLight("directionalLight")
        directionalLight.setDirection((-5, -5, -5))
        directionalLight.setColor((1, 1, 1, 1))
        directionalLight.setSpecularColor((1, 1, 1, 1))
        render.setLight(render.attachNewNode(ambientLight))
        render.setLight(render.attachNewNode(directionalLight))

        self.commData = self.initCommData()
        self.isFire = False

        # 衝突用アイテム
        if(P_NO==0):
            lowl = 1
            highl = 30
            for i in range(G_ITEM_MAX):
                g_item_alive.append(True)
                g_item.append(self.loader.loadModel("models/misc/rgbCube"))
                g_item[i].reparentTo(render)
                g_item[i].setScale(0.5)
                r = self.environ.find("**/hedge_piece_" + str(int(random.uniform(lowl, highl))))
                n = r.getNode(0).solids[int(random.uniform(lowl, highl))].collision_origin
                g_item[i].setPos(n.getX(), n.getY(), n.getZ())
                #g_item[i].setPos(ralphStartPos + (1, 0, 1))
                itemColNode = CollisionNode('CollisionItem_' + str(i))  # 定義名
                itemColNode.addSolid(CollisionBox(0, 1, 1, 1))          # 衝突範囲
                itemColNp = g_item[i].attachNewNode(itemColNode)   # アイテムに追加
                itemColNp.show()
            self.task_mgr.add(self.itemMotionTask, "itemMotionTask")
            g_item_get = ITEM_GET_DONE
            
    def initCommData(self):
        return CommData(TYPE_MOVE, 0.0, 0.0, 0.0, 0.0, False, False, False, 0, [])
    
    # Records the state of the arrow keys
    def setKey(self, key, value):
        self.keyMap[key] = value

    # Accepts arrow keys to move either the player or the menu cursor,
    # Also deals with grid checking and collision detection
    def move(self, task):
        global g_enemy_bullet_on, g_your_point, g_enemy_point, g_item, g_item_alive, g_item_get, g_item_recv
        self.scoreUI.setText("YOU:  " + str(g_your_point) + "  ENEMY:  " + str(g_enemy_point))

        if(g_item_get == ITEM_GET_DONE):
            for i in range(len(g_item_recv)):
                recv = g_item_recv[i]
                if(recv[1]==False):
                    if(g_item and len(g_item)>0):
                        if(g_item[i] != None):
                            g_item[i].remove_node()
                        g_item[i] = None                   
                        g_item_alive[i] = False

        if(g_item_get == ITEM_GET_GET):
            # create item
            for i in range(len(g_item_recv)):
                g_item.append(self.loader.loadModel("models/misc/rgbCube"))
                g_item[i].reparentTo(render)
                g_item[i].setScale(0.5)
                # 座標
                pos = g_item_recv[i][0][0], g_item_recv[i][0][1], g_item_recv[i][0][2]
                g_item[i].setPos(pos)
                # 生存フラグ
                g_item_alive.append(g_item_recv[i][1])
                itemColNode = CollisionNode('CollisionItem_' + str(i))
                itemColNode.addSolid(CollisionBox(0, 1, 1, 1))
                itemColNp = g_item[i].attachNewNode(itemColNode)
                itemColNp.show()
            g_item_get = ITEM_GET_DONE
            self.task_mgr.add(self.itemMotionTask, "itemMotionTask")

        # Get the time that elapsed since last frame.  We multiply this with
        # the desired speed in order to find out with which distance to move
        # in order to achieve that desired speed.
        dt = globalClock.getDt()

        # If the camera-left key is pressed, move camera left.
        # If the camera-right key is pressed, move camera right.

        if self.keyMap["cam-right"]:
            self.camera.setX(self.camera, -20 * dt)
        if self.keyMap["cam-left"]:
            self.camera.setX(self.camera, +20 * dt)

        # save ralph's initial position so that we can restore it,
        # in case he falls off the map or runs into something.

        startpos = self.ralph.getPos()

        # If a move-key is pressed, move ralph in the specified direction.

        if self.keyMap["left"]:
            self.ralph.setH(self.ralph.getH() + 200 * dt)
        if self.keyMap["right"]:
            self.ralph.setH(self.ralph.getH() - 200 * dt)
        if self.keyMap["forward"]:
            self.ralph.setY(self.ralph, -50 * dt)

        if self.keyMap["space"]:
            self.onFire()

        # If ralph is moving, loop the run animation.
        # If he is standing still, stop the animation.

        if self.keyMap["forward"] or self.keyMap["left"] or self.keyMap["right"]:
            if self.isMoving is False:
                self.ralph.loop("run")
                self.isMoving = True
        else:
            if self.isMoving:
                self.ralph.stop()
                self.ralph.pose("walk", 5)
                self.isMoving = False

        # If the camera is too far from ralph, move it closer.
        # If the camera is too close to ralph, move it farther.

        camvec = self.ralph.getPos() - self.camera.getPos()
        camvec.setZ(0)
        camdist = camvec.length()
        camvec.normalize()
        if camdist > 10.0:
            self.camera.setPos(self.camera.getPos() + camvec * (camdist - 10))
            camdist = 10.0
        if camdist < 5.0:
            self.camera.setPos(self.camera.getPos() - camvec * (5 - camdist))
            camdist = 5.0

        # Normally, we would have to call traverse() to check for collisions.
        # However, the class ShowBase that we inherit from has a task to do
        # this for us, if we assign a CollisionTraverser to self.cTrav.
        
        self.cTrav.traverse(render)

        # Adjust ralph's Z coordinate.  If ralph's ray hit terrain,
        # update his Z. If it hit anything else, or didn't hit anything, put
        # him back where he was last frame.
        entries = list(self.ralphGroundHandler.entries)
        entries.sort(key=lambda x: x.getSurfacePoint(render).getZ())
        if len(entries) > 0:
            no=0
            for i in entries:               
                #print("##", no,i.getIntoNode().name, i.getSurfacePoint(render).getZ(), str(datetime.datetime.now()))
                no+=1
                name = i.getIntoNode().name
                #print(name, i.getIntoNode())
                if "CollisionItem_" in name:
                    num = int(name[name.find('_')+1:])
                    g_your_point += 1
                    g_item[num].remove_node()
                    g_item[num] = None
                    g_item_alive[num] = False
                    break
            
                if name == "terrain":
                    self.ralph.setZ(i.getSurfacePoint(render).getZ())
                    break

                self.ralph.setPos(startpos+(0.1, 0.1, 0))
                break

        # 衝突前の位置に戻る
        # else:
        #     self.ralph.setPos(startpos)


        # Keep the camera at one foot above the terrain,
        # or two feet above ralph, whichever is greater.

        entries = list(self.camGroundHandler.entries)
        entries.sort(key=lambda x: x.getSurfacePoint(render).getZ())

        if len(entries) > 0 and entries[0].getIntoNode().name == "terrain":
            self.camera.setZ(entries[0].getSurfacePoint(render).getZ() + 1.0)
        if self.camera.getZ() < self.ralph.getZ() + 2.0:
            self.camera.setZ(self.ralph.getZ() + 2.0)

        if g_enemy_bullet_on == True:
            g_enemy_bullet_on = False
            self.onEnemyFire()

        # The camera should look in ralph's direction,
        # but it should also try to stay horizontal, so look at
        # a floater which hovers above ralph's head.
        self.camera.lookAt(self.floater)

        return task.cont
    
    def onFire(self):
        if(self.isFire==False):
            self.isFire = True
            self.bullet.setH(self.ralph.getH())
            self.bullet.setPos(self.ralph.getPos() + (0, 0, 0.8))

            self.taskMgr.add(self.fireMoveTask, "FireMoveTask")
            self.sendShoot()

    def itemMotionTask(self, task):
        global g_item
        for i in range(G_ITEM_MAX):
            if(g_item[i] != None):
                g_item[i].setHpr(task.time * 30, 0, 0 )
                g_item[i].setR(task.time * 30)
        return task.cont
    
    def onEnemyFire(self):
        global g_enemy_bullet
        g_enemy_bullet.setH(g_enemy_ralph.getH())
        g_enemy_bullet.setPos(g_enemy_ralph.getPos() + (0, 0, 0.8))

        self.taskMgr.add(self.enemyFireMoveTask, "EnemyFireMoveTask")

    def enemyFireMoveTask(self, task):
        global g_enemy_bullet
        g_enemy_bullet.show()
        dt = globalClock.getDt()
        g_enemy_bullet.setY(g_enemy_bullet, -30 * dt)
        return task.cont

    def clearEnemyBullet(self):
        global g_enemy_bullet
        self.taskMgr.remove("EnemyFireMoveTask")
        g_enemy_bullet.hide()

    def fireMoveTask(self, task):
        global g_your_point
        entries = list(self.bulletGroundHandler.entries)
        if(len(entries)==0):
            # 地図の端に到達
            print("over line")
            self.clearBullet()
            return task.cont

        entries.sort(key=lambda x: x.getSurfacePoint(render).getZ())
        bz = self.bullet.getZ()
        
        for e in entries:
            gz = e.getSurfacePoint(render).getZ()
            cn = e.getIntoNode().name
            if("enemyNode" in cn):
                print("HIT ! ", datetime.datetime.now())
                g_your_point += 1
                self.clearBullet()
                return task.cont    
                            
            if ("terrain" in cn and bz <= gz):
                self.clearBullet()
                return task.cont       
            
            if ("rock" in cn or "tree" in cn):
                self.clearBullet()
                return task.cont
      
        dt = globalClock.getDt()
        self.bullet.setY(self.bullet, -30 * dt)
        self.bullet.show()
        return task.cont

    def clearBullet(self):
        self.isFire = False
        self.bullet.hide()
        self.taskMgr.remove("FireMoveTask")

    def c2s(self, task):
        global g_item, g_item_alive
        # 送信データの編集
        self.commData.t = TYPE_MOVE
        self.commData.x = int(self.ralph.getX())
        self.commData.y = int(self.ralph.getY())
        self.commData.h = int(self.ralph.getH())
        self.commData.z = int(self.ralph.getZ())
        self.commData.l = 1 if self.keyMap["left"] else 0 
        self.commData.r = 1 if self.keyMap["right"] else 0
        self.commData.f = 1 if self.keyMap["forward"] else 0
        self.commData.s = g_your_point

        item = []
        for i in range(G_ITEM_MAX):
            if(len(g_item) > 0):
                #print("AAA ", g_item, len(g_item))
                if(g_item[i] == None):
                    item.append((None, g_item_alive[i]))
                else:
                    #print("BBB ", g_item, len(g_item))
                    if(g_item and len(g_item)>0):
                        #print(g_item[i].getPos())
                        pos = (int(g_item[i].getPos().getX()), 
                               int(g_item[i].getPos().getY()), 
                               int(g_item[i].getPos().getZ()))

                        item.append((pos, 1 if g_item_alive[i] else 0))
        self.commData.i = item
        #print("== send ==")
        #print(self.commData)
        self.sendCommData(self.commData)
        return task.cont
    
    def sendCommData(self, data):
        # ソケットの作成
        s =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 送信文字列作成
        send_str = json.dumps(asdict(data), indent=2)
        # 送信
        ip, port = IP_PORT[E_NO]
        serv_address = (ip, port)
        s.sendto((send_str).encode('utf-8'), serv_address)

    def sendShoot(self):
        # 送信データの編集
        self.commData.t = TYPE_BULLET
        self.commData.x = self.ralph.getX()
        self.commData.y = self.ralph.getY()
        self.commData.h = self.ralph.getH()
        self.commData.z = self.ralph.getZ()
        self.commData.l = self.keyMap["left"]
        self.commData.r = self.keyMap["right"]
        self.commData.f = self.keyMap["forward"]
        self.sendCommData(self.commData)

#
# Reciever
#
class Reciever():
    def __init__(self, q):
        self.q = q
        self.host = IP_PORT[P_NO][0]
        self.port = IP_PORT[P_NO][1]
        self.bufsize = 4096
        self.sock =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.host, self.port))
        self.thread = threading.Thread(target=self.recieve, daemon=True)
        self.thread.start()
        g_enemy_ralph.isMoving = False

    def recieve(self):
        global g_enemy_bullet_on, g_enemy_point, g_item_get, g_item_recv
        # 受信
        try:
            while True:
                msg, cli_addr = self.sock.recvfrom(self.bufsize)
                recv_data = json.loads(msg.decode('utf-8'))
                comm_data = CommData(**recv_data)
                if(comm_data.t==TYPE_BULLET):
                    g_enemy_bullet_on = True
                    continue
                #print(comm_data)
                g_enemy_ralph.setX(comm_data.x)
                g_enemy_ralph.setY(comm_data.y)
                g_enemy_ralph.setH(comm_data.h)
                g_enemy_ralph.setZ(comm_data.z)
                g_enemy_point = comm_data.s

                if comm_data.l or comm_data.r or comm_data.f:
                    if g_enemy_ralph.isMoving is False:
                        g_enemy_ralph.loop("run")
                        g_enemy_ralph.isMoving = True
                else:
                    if g_enemy_ralph.isMoving:
                        g_enemy_ralph.stop()
                        g_enemy_ralph.pose("walk", 5)
                        g_enemy_ralph.isMoving = False
                
                if(P_NO!=0):
                    if(len(comm_data.i)>0 and g_item_get == ITEM_GET_WAIT):
                        g_item_recv = []
                        for i in range(len(comm_data.i)):
                            data = comm_data.i[i]
                            item = (data[0], False if data[1]==0 else True)
                            g_item_recv.append(item)
                        g_item_get = ITEM_GET_GET

                if(g_item_get == ITEM_GET_DONE):
                    g_item_recv = []
                    for i in range(len(comm_data.i)):
                        data = comm_data.i[i]
                        item = (data[0],  False if data[1]==0 else True)
                        g_item_recv.append(item)

        except Exception as e:
            print(e)

q = queue.Queue()
Reciever(q)
demo = RoamingRalphDemo(q)
demo.run()
