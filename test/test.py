import requests

url = 'http://10.10.10.19:4000/api/img2pdf'

file_path = 'test.jpeg'

files = {'file': open(file_path, 'rb').read()}
# print(files)
response = requests.post(url, files=files)

print(response.text)
with open('res.pdf', 'wb') as f:
    f.write(response.content);