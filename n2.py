#!/usr/bin python3
# coding: utf-8
import pygame
from pygame.locals import *
import os
import sys
from dataclasses import dataclass, asdict
import socket
import threading
import json
from PyQt6.QtWidgets import QApplication,QWidget,QPushButton

# ----------------------------------------
# player Number
# 自プレイヤー番号 0,1,2
P_NO = 1
# ----------------------------------------
# プレイヤー人数
P_NUM = 3
# キャライメージ開始Index
CHAR_START_ID = [51, 48, 0]

# connection info
IP_MASA = '100.115.92.203'
IP_PAPA = '192.168.0.28'
IP_MAMA = '192.168.0.31'
IP_MIRE = '192.168.0.xx'

PORT_2222 = 2222
PORT_2223 = 2223
PORT_2224 = 2224

#IP_PORT = [(IP_MASA, PORT_2222), (IP_MAMA, PORT_2222), (IP_MASA, PORT_2222)]
IP_PORT = [(IP_MASA, PORT_2222), (IP_MASA, PORT_2223), (IP_MASA, PORT_2224)]

# フロアマップファイル
FLOOR_FILE = ['data/floor_01.map', 
              'data/floor_02.map', 
              'data/floor_03.map', 
              'data/floor_04.map',
              'data/floor_05.map',
              'data/floor_06.map',
              'data/floor_07.map',]

# ゲーム画面サイズ
WIDTH = 640
HEIGHT = 480
SCR_RECT = Rect(0, 0, WIDTH, HEIGHT)

# プレイヤー状態
STAT_ALIVE = 0      # 生きてる
STAT_DEAD = 1       # 死んでる
STAT_REBORN = 2     # 復活

# プレイヤー初期位置
LOC_INFO = [33, 33, 100, 33, 200, 33]
#LOC_INFO = [33, 33, 1582, 792]

# 色の定義
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
SCORE_COLOR = (0, 128, 255)

CHAR_IMG_SIZE = 32
CHAR_IMG_ROW_MAX = 8
CHAR_IMG_COL_MAX = 12
CHAR_IMG_NUM = 3
ANIME_SPEED = 0.1

V_DOWN = 0
V_LEFT = 1
V_RIGHT = 2
V_UP = 3

PNO_SCORE = 9

# キャラ位置、方向、アニメクラス
@dataclass
class CharInfo:
    x: float            # x座標
    y: float            # y座標
    vec: int            # 方向
    player_no: int      # 自プレイヤー番号 0,1,2
    image_no: int       # 画像No.
    floor_no: int       # フロア番号

# 通信データクラス
@dataclass
class CommData:
    char_info: CharInfo # 自プレイヤー位置、方向、アニメ
    stat: int           # 自プレイヤー状態
    shots: dict         # 自弾辞書
    score: int          # 自得点
    by_pno: int         # 誰にやられたか(player_no)

# クライアントクラス
class Client():
    def __init__(self):
        pygame.init()        
        pygame.display.set_caption("Masato Python Study :)")
        self.screen = pygame.display.set_mode(SCR_RECT.size)
        self.commData = CommData(CharInfo(0, 0, V_DOWN, P_NO, 0, 0), STAT_ALIVE, [], 0, -1)
        self.font = pygame.font.Font(None, 40)
        # 全キャラ画像の読み込み
        base_image = load_image("all_char.png", -1)
        base_image = base_image.convert()
        ix = 0
        self.all_images = []
        for row in range(CHAR_IMG_ROW_MAX):
            for col in range(CHAR_IMG_COL_MAX):
                self.all_images.append(pygame.Surface((CHAR_IMG_SIZE, CHAR_IMG_SIZE)))
                self.all_images[ix].blit(base_image, (0, 0), pygame.Rect((CHAR_IMG_SIZE*col), (CHAR_IMG_SIZE*row), CHAR_IMG_SIZE, CHAR_IMG_SIZE))        
                colorkey = self.all_images[ix].get_at((0,0))
                self.all_images[ix].set_colorkey(colorkey, pygame.RLEACCEL)
                ix += 1

        # 自分画像のロード
        MyChar.image = load_image("blank.png", -1)
        # 相手画像のロード
        Enemy.image = load_image("blank.png", -1)
        # 壁画像のロード
        Block.image = load_image("red_block.png", -1)
        # 自弾画像のロード
        Shot.image = load_image("fireball.png", -1)
        # 相手弾画像のロード
        EnemyShot.image = load_image("fireball.png", -1)
        # 下り階段画像のロード
        DownStaireway.image = load_image("down_stairway.png", -1)
        # 上り階段画像のロード
        UpStaireway.image = load_image("up_stairway.png", -1)

        self.floor = 0        
        self.map = Map(FLOOR_FILE[self.floor], self.all_images)

        self.reciever = Reciever(self.map)
        
    def c2s(self):
        # ソケットの作成
        s =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 送信データの編集
        self.commData.stat = self.map.my_char.status

        self.commData.char_info.x = self.map.my_char.rect.x
        self.commData.char_info.y = self.map.my_char.rect.y
        self.commData.char_info.vec = self.map.my_char.vec
        self.commData.char_info.player_no = P_NO
        self.commData.char_info.image_no = self.map.my_char.image_index
        self.commData.char_info.floor_no = self.map.my_char.floor
        self.commData.shots = self.edit_shots_dict()
        self.commData.score = self.map.my_char.score
        # 送信文字列作成
        send_str = json.dumps(asdict(self.commData), indent=2)
        # 送信
        for i in range(P_NUM):
            if(i!=P_NO):
                ip, port = IP_PORT[i]
                serv_address = (ip, port)
                s.sendto((send_str).encode('utf-8'), serv_address)

        if(self.commData.stat == STAT_REBORN):
            self.map.my_char.status = STAT_ALIVE

    def send_dead(self):
        # ソケットの作成
        s =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 送信データの編集
        self.commData = CommData(CharInfo(0, 0, 0, PNO_SCORE, 0, 0), 0, [], 0, self.map.my_char.by_pno)
        # 送信文字列作成
        send_str = json.dumps(asdict(self.commData), indent=2)
        # 送信
        for e in self.map.enemys:
            #if(i!=P_NO):    
            if(e.no==self.map.my_char.by_pno):
                ip, port = IP_PORT[e.no]
                serv_address = (ip, port)
                s.sendto((send_str).encode('utf-8'), serv_address)
                break

    # 自弾辞書の編集
    def edit_shots_dict(self):
        edit_dict = []
        for k,v in self.map.my_char.shots_history.items():
            shot, flag = v
            if(flag==False):
                edit_dict.append(shot.get_pos())
                self.map.my_char.shots_history[k] = (shot, True)
        return edit_dict
        # sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    def main(self):
        # メインループ
        clock = pygame.time.Clock()
        while True:
            clock.tick(60)
            self.screen.fill((0,0,0))

            # 更新
            self.update()
            # 表示
            self.draw(self.screen)
            # 死亡判定
            self.judgeDead()
            # 自情報を送信
            self.c2s()
            # スコア表示
            self.display_score()            
            # キー入力
            self.key_handler()

            pygame.display.flip()

    def update(self):
        self.map.update()

    def draw(self, screen):
        self.map.draw()
        
        # オフセッとに基づいてマップの一部を画面に描画
        offsetx, offsety = self.map.calc_offset()
        
        # 端ではスクロールしない
        if offsetx < 0:
            offsetx = 0
        elif offsetx > self.map.width - SCR_RECT.width:
            offsetx = self.map.width - SCR_RECT.width
        
        if offsety < 0:
            offsety = 0
        elif offsety > self.map.height - SCR_RECT.height:
            offsety = self.map.height - SCR_RECT.height
        
        # マップの一部を画面に描画
        screen.blit(self.map.surface, (0,32), (offsetx, offsety, SCR_RECT.width, SCR_RECT.height))

    def judgeDead(self):
        if(self.map.my_char.status == STAT_DEAD):
            # 死亡通知送信
            self.send_dead()
            # 相手弾のクリア
            self.map.enemy_shots.remove([s for s in self.map.enemy_shots])
            self.map.my_char.status = STAT_REBORN
            # 自位置のクリア
            self.map.my_char.rect.x = LOC_INFO[2*P_NO+0]
            self.map.my_char.rect.y = LOC_INFO[2*P_NO+1]
            self.map.my_char.fpx = float(self.map.my_char.rect.x)
            self.map.my_char.fpy = float(self.map.my_char.rect.y)
            # g_qAp = QApplication(sys.argv)
            # g_dialog = Dialog(self.map)
            # g_dialog.show()
            # g_qAp.exec()

    def key_handler(self):
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == KEYDOWN and event.key == K_ESCAPE:
                pygame.quit()
                sys.exit()

        if(self.map.on_up_stairways()):
            self.floor -= 1
            self.change_map(FLOOR_FILE[self.floor])

        if(self.map.on_down_stairways()):
            self.floor += 1
            self.change_map(FLOOR_FILE[self.floor])

    def change_map(self, filename):
        self.map.change_map(self.floor, filename)

    # スコア表示
    def display_score(self):
        if(P_NO==0):
            name=['PAPA', 'MAMA', 'MIRE']
        if(P_NO==1):
            name=['MAMA', 'PAPA', 'MIRE']
        if(P_NO==2):
            name=['MIRE', 'PAPA', 'MAMA']
        score = []
        score.append(self.map.my_char.score)
        for e in self.map.enemys:
            score.append(e.score)
        # スコア表示
        for i in range(len(score)):
            ss = self.font.render(name[i] + ' : ' + str(score[i]), True, SCORE_COLOR)
            self.screen.blit(ss, (i*200, 2))
        
class Shot(pygame.sprite.Sprite):
    def __init__(self, center, vec, blocks, enemy_shots, pno, shots_history, floor):
        # imageとcontainersはmain()でセット
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.center = center           # 中心座標をposに
        self.vec = vec                      # 方向
        self.blocks = blocks                # 壁
        self.speed = 9                      # 弾の移動速度
        self.enemy_shots = enemy_shots      # 相手弾
        self.pno = pno                      # プレイヤー番号
        self.shots_history = shots_history  # 自弾発射履歴
        self.floor = floor                  # 階数

    def update(self):
        if self.vec == V_UP:
            self.rect.move_ip(0, -self.speed)   # 上へ移動
        elif self.vec == V_RIGHT:
            self.rect.move_ip(self.speed, 0)    # 右へ移動
        elif self.vec == V_DOWN:
            self.rect.move_ip(0, self.speed)    # 下へ移動
        elif self.vec == V_LEFT:
            self.rect.move_ip(-self.speed, 0)   # 左へ移動

        """衝突判定"""
        # ブロックと弾の衝突判定
        for block in self.blocks:
            collide = self.rect.colliderect(block.rect)
            # 衝突あり
            if collide:
                # 自弾履歴辞書から削除
                if(id(self) in self.shots_history.keys()):
                    self.shots_history.pop(id(self))
                # 自弾オブジェクトの削除             
                self.kill()
                return

        # 相手弾と自弾との衝突判定
        for enemy_shot in [i for i in self.enemy_shots]:
            collide = self.rect.colliderect(enemy_shot.rect)
            # 衝突あり
            if collide:
                # 自弾履歴辞書から削除
                if(id(self) in self.shots_history.keys()):
                    self.shots_history.pop(id(self))
                # 相手弾オブジェクトの削除
                enemy_shot.kill()
                # 自弾オブジェクトの削除
                self.kill()
                return

    def get_pos(self):
        return CharInfo(self.rect.x, self.rect.y, self.vec, self.pno, 0, self.floor)

# 相手の弾クラス
class EnemyShot(pygame.sprite.Sprite):
    def __init__(self, pos, vec, blocks, pno, floor):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.center = pos      # 中心座標をposに
        self.vec = vec              # 方向
        self.blocks = blocks        # 衝突判定用
        self.speed = 9              # 弾の移動速度
        self.pno = pno              # プレイヤー番号
        self.floor = floor          # 階数
        
    def update(self):
        if self.vec == V_UP:
            self.rect.move_ip(0, -self.speed)   # 上へ移動
        elif self.vec == V_RIGHT:
            self.rect.move_ip(self.speed, 0)    # 右へ移動
        elif self.vec == V_DOWN:
            self.rect.move_ip(0, self.speed)    # 下へ移動
        elif self.vec == V_LEFT:
            self.rect.move_ip(-self.speed, 0)   # 左へ移動

        """衝突判定"""
        # ブロックと弾の衝突判定
        for block in self.blocks:
            collide = self.rect.colliderect(block.rect)
            if collide:
                # 弾オブジェクトの削除             
                self.kill()

class MyChar(pygame.sprite.Sprite):
    """自プレイヤー"""
    MOVE_SPEED = 4.0    # 移動速度
    RELOAD_TIME = 4     # リロード時間

    def __init__(self, pos, blocks, enemy_shots, all_images, floor):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.x, self.rect.y = pos[0], pos[1]
        self.blocks = blocks
        self.reload_timer = 0
        self.enemy_shots = enemy_shots   
        self.walk = 0
        if(P_NO==0):
            self.image_start = CHAR_START_ID[0]
        if(P_NO==1):
            self.image_start = CHAR_START_ID[1]
        if(P_NO==2):
            self.image_start = CHAR_START_ID[2]
        self.image_max = self.image_start + CHAR_IMG_NUM

        self.fpx = float(self.rect.x)
        self.fpy = float(self.rect.y)
        self.fpvx = 0.0
        self.fpvy = 0.0

        self.vec = V_DOWN
        self.image_index = self.calc_image_index()
        self.score = 0
        self.status = STAT_ALIVE
        self.all_images = all_images

        # 自弾発射履歴
        self.shots_history = {}
        self.floor = floor
        # 誰にやられたか
        self.by_pno = -1
        
    def update(self):
        # 生きてなければ動けない
        if(self.status == STAT_DEAD):
            return
        # キー入力取得
        pressed_keys = pygame.key.get_pressed()
        # 上下左右移動
        self.fpvx = 0.0
        self.fpvy = 0.0
        if pressed_keys[K_RIGHT]:
            self.fpvx = self.MOVE_SPEED
            self.vec = V_RIGHT
            self.image = self.all_images[self.calc_image_index()]
        if pressed_keys[K_LEFT]:
            self.fpvx = -self.MOVE_SPEED
            self.vec = V_LEFT
            self.image = self.all_images[self.calc_image_index()]
        if pressed_keys[K_UP]:
            self.fpvy = -self.MOVE_SPEED
            self.vec = V_UP
            self.image = self.all_images[self.calc_image_index()]
        if pressed_keys[K_DOWN]:           
            self.fpvy = +self.MOVE_SPEED
            self.vec = V_DOWN
            self.image = self.all_images[self.calc_image_index()]

        # 弾の発射
        if pressed_keys[K_SPACE]:
            # リロード時間になるまで再発射できない
            if self.reload_timer > self.RELOAD_TIME:
                # 自弾のオブジェクト辞書に追加
                shot = Shot(self.rect.center, self.vec, self.blocks, 
                            self.enemy_shots, P_NO, self.shots_history, self.floor)
                self.shots_history[id(shot)] = (shot, False)
                self.reload_timer = 0
            else:
                # リロード中
                self.reload_timer += 1

        self.collision_x()  # X方向の衝突判定処理
        self.collision_y()  # Y方向の衝突判定処理
        
        self.rect.x = int(self.fpx)
        self.rect.y = int(self.fpy)
        
    def calc_image_index(self):
        self.walk += ANIME_SPEED
        if(self.walk >= CHAR_IMG_NUM):
            self.walk = 0.0
        self.image_index = self.image_start + int(self.walk)+ (self.vec * CHAR_IMG_COL_MAX)
        return self.image_index
    
    def collision_x(self):
        """X方向の衝突判定処理"""
        # 自プレイヤーのサイズ
        width = self.rect.width
        height = self.rect.height
        
        # X方向の移動先の座標と矩形を求める
        newx = self.fpx + self.fpvx
        newrect = Rect(newx, self.fpy, width, height)
        
        # ブロックとの衝突判定
        for block in self.blocks:
            collide = newrect.colliderect(block.rect)
            if collide:
                # 衝突するブロックあり
                if self.fpvx > 0:
                    # 右に移動中に衝突
                    # めり込まないように調整して速度を0に
                    self.fpx = block.rect.left - width
                    self.fpvx = 0
                elif self.fpvx < 0:
                    # 左に移動中に衝突
                    self.fpx = block.rect.right
                    self.fpvx = 0
                break
            else:
                # 衝突ブロックがない場合、位置を更新
                self.fpx = newx
    
    def collision_y(self):
        """Y方向の衝突判定処理"""
        # 自プレイヤーのサイズ
        width = self.rect.width
        height = self.rect.height
        
        # Y方向の移動先の座標と矩形を求める
        newy = self.fpy + self.fpvy
        newrect = Rect(self.fpx, newy, width, height)
        
        # ブロックとの衝突判定
        for block in self.blocks:
            collide = newrect.colliderect(block.rect)
            if collide:
                # 衝突するブロックあり
                if self.fpvy > 0:
                    # 下に移動中に衝突
                    # めり込まないように調整して速度を0に
                    self.fpy = block.rect.top - height
                    self.fpvy = 0
                elif self.fpvy < 0:
                    # 上に移動中に衝突
                    self.fpy = block.rect.bottom
                    self.fpvy = 0
                break
            else:
                # 衝突ブロックがない場合、位置を更新
                self.fpy = newy

    def collision_enemy_shots(self):
        if(self.status != STAT_DEAD):
            # 相手弾との衝突判定
            for shot in self.enemy_shots:
                if(self.floor == shot.floor):
                    collide = self.rect.colliderect(shot.rect)
                    # 衝突あり
                    if collide:
                        print("you died ! [", P_NO, "]")
                        shot.kill()
                        self.status = STAT_DEAD
                        self.by_pno = shot.pno
                        return True
        return False

class Enemy(pygame.sprite.Sprite):
    """相手プレイヤー"""
    def __init__(self, no, pos, shots, floor):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.x, self.rect.y = pos[0], pos[1]
        self.shots = shots          # 自弾
        self.no = no                # プレイヤー番号
        self.status = STAT_ALIVE    # 状態
        self.score = 0              # スコア
        self.floor = floor          # 階数

    def collision_shots(self):
        # 生きていれば判定する
        if(self.status != STAT_DEAD):
            # 自弾と相手との衝突判定
            for shot in self.shots:
                if(self.floor == shot.floor):
                    collide = self.rect.colliderect(shot.rect)
                    # 衝突あり
                    if collide:
                        print("### Enemy died no count ! [", self.no, "]")
                        shot.kill()
                        self.status = STAT_DEAD
                        return True
        return False

class Block(pygame.sprite.Sprite):
    """ブロック"""
    def __init__(self, pos):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.topleft = pos

class UpStaireway(pygame.sprite.Sprite):
    """上り階段"""
    def __init__(self, pos):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.topleft = pos

class DownStaireway(pygame.sprite.Sprite):
    """下り階段"""
    def __init__(self, pos):
        pygame.sprite.Sprite.__init__(self, self.containers)
        self.rect = self.image.get_rect()
        self.rect.topleft = pos

class Map:
    """マップ（プレイヤーや内部のスプライトを含む）"""
    GS = 33  # グリッドサイズ
    
    def __init__(self, filename, all_images):

        self.all_images = all_images
        # スプライトグループの登録
        self.all = pygame.sprite.RenderUpdates()
        self.blocks = pygame.sprite.Group()
        self.enemys = pygame.sprite.Group()
        self.shots = pygame.sprite.Group()
        self.enemy_shots = pygame.sprite.Group()
        self.down_stairways = pygame.sprite.Group()
        self.up_stairways = pygame.sprite.Group()

        MyChar.containers = self.all
        Block.containers = self.all, self.blocks
        DownStaireway.containers = self.all, self.down_stairways
        UpStaireway.containers = self.all, self.up_stairways
        Enemy.containers = self.all, self.enemys
        Shot.containers = self.all, self.shots
        EnemyShot.containers = self.all, self.enemy_shots

        # create my char
        self.my_char = MyChar((LOC_INFO[2*P_NO+0], LOC_INFO[2*P_NO+1]), self.blocks, self.enemy_shots, self.all_images, 0)
        # create enemy char
        for i in range(P_NUM):
            if(i != P_NO):
                Enemy(i, (LOC_INFO[2*i+0], LOC_INFO[2*i+1]), self.shots, 0)

        self.change_map(0, filename)

        # マップサーフェイスを作成
        self.surface = pygame.Surface((self.col*self.GS, self.row*self.GS)).convert()

    def change_map(self, floor, filename):
        # 自弾スプライトの削除
        if(hasattr(self, 'shots')):
            for b in [b for b in self.shots]:
                b.kill()   
        # 階段スプライトの削除
        if(hasattr(self, 'down_stairways')):
            for b in [b for b in self.down_stairways]:
                b.kill()            
        if(hasattr(self, 'up_stairways')):
            for b in [b for b in self.up_stairways]:
                b.kill()            
        # 壁スプライトの削除
        if(hasattr(self, 'blocks')):
            for b in [b for b in self.blocks]:
                b.kill()
        # 相手キャラスプライトの表示抑止
        if(hasattr(self, 'enemys')):
            for e in self.enemys:
                if(floor != e.floor):
                    e.rect.x = -33
                    e.rect.y = -33
        # 階数更新
        self.my_char.floor = floor
        # マップをロードしてマップ内スプライトの作成
        self.load(filename)

    def draw(self):
        """マップサーフェイスにマップ内スプライトを描画"""
        self.surface.fill((0,0,0))
        self.all.draw(self.surface)

    def update(self):
        """マップ内スプライトを更新"""
        self.all.update()

        # 自弾と相手プレイヤーとの衝突判定
        if(hasattr(self, 'enemys')):
            for enemy in self.enemys:
                if(enemy.collision_shots()):
                    # self.my_char.score += 1
                    # 相手位置のクリア
                    enemy.rect.x = LOC_INFO[2*enemy.no+0]
                    enemy.rect.y = LOC_INFO[2*enemy.no+1]
                    enemy.fpx = float(enemy.rect.x)
                    enemy.fpy = float(enemy.rect.y)

        # 相手弾と自プレイヤーとの衝突判定
        self.my_char.collision_enemy_shots()

    def calc_offset(self):
        """オフセットを計算"""
        offsetx = self.my_char.rect.topleft[0] - SCR_RECT.width/2
        offsety = self.my_char.rect.topleft[1] - SCR_RECT.height/2
        return offsetx, offsety

    def load(self, filename):
        """マップをロードしてスプライトを作成"""
        map = []
        fp = open(filename, "r")
        for line in fp:
            line = line.rstrip()  # 改行除去
            map.append(list(line))

        self.row = len(map)
        self.col = len(map[0])
        self.width = self.col * self.GS
        self.height = self.row * self.GS
        fp.close()
        
        # マップからスプライトを作成
        for i in range(self.row):
            for j in range(self.col):
                if map[i][j] == 'B':
                    Block((j*self.GS, i*self.GS))           # ブロック
                if map[i][j] == 'U':
                    UpStaireway((j*self.GS, i*self.GS))     # 上り階段
                if map[i][j] == 'D':
                    DownStaireway((j*self.GS, i*self.GS))   # 下り階段

    def create_enemy_shot(self, x, y, v, pno):
        EnemyShot((x, y), v, self.blocks, pno, self.my_char.floor)

    def on_up_stairways(self):
        if(hasattr(self, "up_stairways")):       
            for s in self.up_stairways:
                collide = self.my_char.rect.colliderect(s.rect)
                if(collide):
                    return True
        return False
    
    def on_down_stairways(self):
        if(hasattr(self, "down_stairways")):       
            for s in self.down_stairways:
                collide = self.my_char.rect.colliderect(s.rect)
                if(collide):
                    return True
        return False

def load_image(filename, colorkey=None):
    """画像をロードして画像と矩形を返す"""
    filename = os.path.join("data", filename)
    try:
        image = pygame.image.load(filename)
    except pygame.error:
        print("Cannot load image:", filename)
        raise SystemExit
    image = image.convert()
    if colorkey is not None:
        if colorkey == -1:
            colorkey = image.get_at((0,0))
        image.set_colorkey(colorkey, RLEACCEL)
    return image
#
# Reciever
#
class Reciever():
    def __init__(self, map):
        self.map = map
        self.host = IP_PORT[P_NO][0]
        self.port = IP_PORT[P_NO][1]
        self.bufsize = 1024
        self.sock =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.host, self.port))
        self.thread = threading.Thread(target=self.recieve, daemon=True)
        self.thread.start()
        self.floor = 0

    def recieve(self):
        # 受信
        try:
            while True:
                msg, cli_addr = self.sock.recvfrom(self.bufsize)
                recv_data = json.loads(msg.decode('utf-8'))
                comm_data = CommData(**recv_data)
                char_info = CharInfo(**comm_data.char_info)
                if(char_info.player_no == PNO_SCORE):
                    self.map.my_char.score += 1
                    continue
                for e in self.map.enemys:
                    if(e.no==char_info.player_no):
                        if(comm_data.stat == STAT_REBORN):                          
                            e.status = STAT_ALIVE
                            self.clear(e)
                        elif(comm_data.stat == STAT_DEAD):
                            self.clear(e)
                        else:
                            # 相手情報の更新
                            # 位置
                            if(self.map.my_char.floor != char_info.floor_no):
                                e.rect.x = -33
                                e.rect.y = -33
                            else:
                                e.rect.x = char_info.x
                                e.rect.y = char_info.y
                            # 画像
                            e.image = self.map.all_images[char_info.image_no]
                            # 状態
                            e.status = STAT_ALIVE
                            # スコア
                            e.score = comm_data.score
                            # 階数
                            e.floor = char_info.floor_no
                            # 相手弾の生成
                            for s in comm_data.shots:
                                if(self.map.my_char.floor == char_info.floor_no):
                                    info = CharInfo(**s)
                                    self.map.create_enemy_shot(info.x, info.y, info.vec, info.player_no)

                        break
      
        except Exception as e:
            print(e)

    def clear(self, e):
        # 相手弾のクリア
        for s in self.map.enemy_shots:
            s.kill()
        # 相手位置のクリア
        e.rect.x = LOC_INFO[2*e.no+0]
        e.rect.y = LOC_INFO[2*e.no+1]

class Dialog(QWidget):
    def __init__(self, map):
        super().__init__()
        self.setWindowTitle('無念')
        button = QPushButton('やられました...',self)
        button.setGeometry(25,25,150,25)
        button.clicked.connect(self.pushed)
        self.map = map

    def pushed(self):
        if(self.map.my_char.status == STAT_DEAD):
            print("Reborn ! [", P_NO, "]")
            self.map.my_char.status = STAT_REBORN
        self.close()

if __name__ == "__main__":

    # クライアントインスタンス生成
    client = Client()
    # クライアント起動
    client.main()
