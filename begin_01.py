import pygame

# pygame開始(初期化)
pygame.init()

# 画面定義作成
screen = pygame.display.set_mode((800, 600))
running = True

while running:
    # 終了判定
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 円を描く
    pygame.draw.circle(screen, "blue", (100, 100), 20)

    # 画面表示
    pygame.display.flip()

# pygame終了
pygame.quit()
