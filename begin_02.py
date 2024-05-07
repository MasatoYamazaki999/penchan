#
# Pythonお勉強用
#
import pygame

# pygame setup
pygame.init()
screen = pygame.display.set_mode((800, 600))
running = True
MOVE_SPEED = 1

player_pos = pygame.Vector2(100, 100)

while running:
    # キー入力
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 画面を黒で塗りつぶす
    screen.fill("black")

    # 位置に円を描く
    pygame.draw.circle(screen, "blue", player_pos, 20)

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