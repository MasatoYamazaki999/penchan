
import random

def hit(inp, ans):
    hit = 0
    for i in range(len(ans)):
        if inp[i] == ans[i]:
            hit += 1

    return hit

def blow(inp, ans):
    blow = 0
    for i in range(len(ans)):
        if inp[i] in ans and inp[i] != ans[i]:
            blow += 1
    return blow


