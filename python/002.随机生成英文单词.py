# pip install Random-Word
from random_word import RandomWords
a=0
while a<10:
    a += 1
    r = RandomWords()
    # Return a single random word
    print (r.get_random_word())
