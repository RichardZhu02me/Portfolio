import imports

history = []
while (True):
    while len(history) > 6: 
        history.pop(0) 
    s = input("Input Stream for Groq llama-3:")
    print("")
    if s == 'q' or s == 'quit' : 
        break
    r = imports.main.stream_response(s, history)
    i= 0
    for partial in r:
        i+=1
    print(partial)
    history.append(s)
    history.append(partial)