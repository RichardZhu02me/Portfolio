import imports

r = imports.main.stream_response("what is Richard's cumulative GPA?", None)
i= 0
for chunk in r:
  i+=1
print(chunk)

r = imports.main.stream_response("what is Richard's GPA in computer science courses? Explain your thinking and show your work.", None)
i= 0
for chunk in r:
  i+=1
print(chunk)

s = imports.main.stream_response("what is Richard's Major GPA?", None)
i= 0
for chunk in s:
  i+=1
print(chunk)
