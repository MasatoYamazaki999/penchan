#
# Pythonお勉強用
#
import pygame
import socket
from dataclasses import dataclass, asdict
import threading
import json
from pygame.locals import *
import os
import sys

# pygame setup
pygame.init()
screen = pygame.display.set_mode((800, 600))
running = True
MOVE_SPEED = 0.5

player_pos = pygame.Vector2(100, 100)
enemy_pos = pygame.Vector2(200, 200)

SEND_IP = "192.168.0.28"
RECV_IP = "192.168.0.31"

@dataclass
class CommData:
    x: int
    y: int

class Reciever():
    def __init__(self):
        self.host = RECV_IP
        self.port = 2222
        self.bufsize = 1024
        self.sock =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.host, self.port))
        self.thread = threading.Thread(target=self.recieve, daemon=True)
        self.thread.start()

    def recieve(self):
        # 受信
        try:
            while True:
                msg, cli_addr = self.sock.recvfrom(self.bufsize)
                recv_data = json.loads(msg.decode('utf-8'))
                comm_data = CommData(**recv_data)
                print(comm_data)
                enemy_pos.x = comm_data.x
                enemy_pos.y = comm_data.y
        except Exception as e:
            print(e)

Reciever()


while running:
    # キー入力
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 画面を黒で塗りつぶす
    screen.fill("black")

    # 自分表示
    pygame.draw.rect(screen, (255, 255, 255), [player_pos.x, player_pos.y, 10, 10])
    # 相手表示
    pygame.draw.rect(screen, (0, 255, 0), [enemy_pos.x, enemy_pos.y, 10, 10])

    # 自分の位置を送信
    s =  socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    serv_address = (SEND_IP, 2222)
    comm_data = CommData(player_pos.x, player_pos.y)
    send_str = json.dumps(asdict(comm_data), indent=2)
    
    s.sendto((send_str).encode('utf-8'), serv_address)

    # キー入力による移動(位置の値を変えているだけ)
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        player_pos.y -= MOVE_SPEED
    if keys[pygame.K_DOWN]:
        player_pos.y += MOVE_SPEED
    if keys[pygame.K_LEFT]:
        player_pos.x -= MOVE_SPEED
    if keys[pygame.K_RIGHT]:
        player_pos.x += MOVE_SPEED

    pygame.display.flip()

pygame.quit()

