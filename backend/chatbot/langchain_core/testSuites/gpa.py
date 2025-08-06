import imports

r = imports.main.stream_response("what is Richard Zhu's cumulative GPA?", None)
i= 0
for chunk in r:
  i+=1
print(chunk)
