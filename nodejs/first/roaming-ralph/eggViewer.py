#!/usr/bin/env python

from direct.showbase.ShowBase import ShowBase
from panda3d.core import Quat
from direct.task import Task

global camera
class ShowEgg(ShowBase):

    def __init__(self):
        ShowBase.__init__(self)

        self.disableMouse()
        camera.setPosHpr(0, 0, 0, 0, 0, 0)

        self.cube = self.loader.loadModel("models/misc/rgbCube.egg")
        self.cube.reparentTo(self.render)
        self.cube.setScale(.5)
        self.cube.setPos(0, 5, 0)
        self.cube.setHpr(45, 0, 45)
        self.cube.setQuat( Quat( 0, 1, 1, 1 ) )

        self.taskMgr.add(self.cubeMotionTask, "CubeMotionTask")

    def cubeMotionTask(self, task):
        self.cube.setHpr( -(task.time * 20), 0, 0 )
        self.cube.setR(task.time * 20)
        return Task.cont
    
app = ShowEgg()
app.run()
