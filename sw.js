const staticCacheName = 'currnverter-static-v2';

self.addEventListener('install', event => {
	console.log(event);

	const cachedUrls = [
		'/',
		'/currnverter.css',
		'/index.js'
	];
	event.waitUntil(
		//Make a cache for static resources
		caches.open(staticCacheName).then(
			cache => cache.addAll(cachedUrls))
	);
	console.log('installed');
});

self.addEventListener('activate', event => {
	console.log(event)	
	
	event.waitUntil(caches.keys().then(
		cacheNames => {
			return Promise.all(cacheNames.filter(
				cacheName => (cacheName.startsWith('currnverter-') && 
				cacheName !== staticCacheName)
				).map(cacheName => caches.delete(cacheName))
			);
		})
	);
	
	console.log('activated');
});

self.addEventListener('fetch', event => {
	console.log(event);
	event.waitUntil(caches.match(event.request).then(
		response => (response || fetch(event.request))
		)
	);
});
	
self.addEventListener('message', event => {
	// Take messages and take actions for :
	// skipWaiting
	// User Interractions
	console.log(event, event.data);
	if(event.data.action == 'skipWaiting') self.skipWaiting();
});

/*
self.registration.showNotification('Notification Title', {
    //Notification options
    body: 'text'
    badge:
    icon:
    image //backgroundimage
    tag: 'text'
    renotify //true/false
    data: {}
    requireInteraction: true/false
    actions: [{action:'id',title:'',icon:'/path/to/img.ext'},{},...{}]
    silent: true/false
    sound:'/path'
    vibrate: [start, stop, continue, stop,...]
    **
});
*/