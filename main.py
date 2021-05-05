from urllib.request import urlopen

tg_url = "https://tango-gacha.com/old"
tg_page = urlopen(tg_url)
tg_html = tg_page.read().decode("utf-8")

print(tg_html)