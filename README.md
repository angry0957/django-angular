# ngdj
Django with Angular 6

This repo is a partial implementation of Django with Angular.

Before start, change: 
1. `server/config/settings.py` line 28 to `ALLOWED_HOST = ['YOUR_IP']`
2. `client/src/app/app.component.ts` line 12 into `url = 'YOUR_IP:DJANGO_HOST/product'`
3. `client/src/app/app.component.ts` line 18 to 23 into your custom ts function
4. `client/src/app/app.component.html` line 10 to 17 into your custom html

To solve CORS problem, I recommend using `--proxy-config config.js` option in ng serve, but I also recommend [this plugin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-ntp-icon) in development level.

In 'YOUR_IP:ANGULAR_HOST', the button `product/` will show 1) console.log(res._body) 2) alert(res._body) 3) html in the blank li.

To communicate with server and user, the client first get information(request) from user, then the client make another request to server.
The server responses to client, then client reponses to user.
It seems something inefficient and slow, but since we can divide data request in the client, we can reduce the total traffic of the client in large scale.

We have to improve:
1. How to get an information efficiently from res in the server to html in the client?
2. How to solve CORS problem efficiently?
3. How to solve ip address problem efficiently? (I think buying a domain is a great solution)
4. What to implement?# django-angular
