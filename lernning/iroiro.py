########################################
#####   オブジェクト指向を少しだけ   #####
#####    ～ クラスを自作する ～      #####
########################################

import tkinter as tk

class Ball:
    def __init__(self, x, y, size, movex, movey, color):
        self.x = x
        self.y = y
        self.size = size
        self.movex = movex
        self.movey = movey
        self.color = color
    
    def draw(self):
        can.create_oval(self.x, self.y, self.x+self.size, self.y+self.size, fill=self.color)
    
    def move(self):
        if key==False :
            self.x += self.movex
            self.y += self.movey
        if self.x<=0 or self.x>=500-self.size :
            self.movex *= -1
        if self.y<=0 or self.y>=500-self.size :
            self.movey *= -1

class Rectangle(Ball):
    def draw(self):
        can.create_rectangle(self.x, self.y, self.x+self.size, self.y+self.size, fill=self.color)

win = tk.Tk()
can = tk.Canvas(win, width=500, height=500, bg="white")
can.pack()

key = False
def keyPress(event):
    global key
    key = True

def keyRelease(event):
    global key
    key = False

win.bind("<Any-KeyPress>", keyPress)
win.bind("<Any-KeyRelease>", keyRelease)

ball = Ball(50, 50, 20, 5, -5, "red")
ball2 = Ball(250, 300, 50, -10, 8, "green")
rectangle = Rectangle(400, 300, 80, -20, -50, "blue")

def drawLoop():
    can.delete("all")
    ball.draw()
    ball.move()
    ball2.draw()
    ball2.move()
    rectangle.draw()
    rectangle.move()
    win.after(30, drawLoop)

drawLoop()

win.mainloop()