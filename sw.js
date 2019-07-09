self.addEventListener('install', event => {
    event.waitUntil(
        //Make a cache for static resources
        console.log(event) //Make sure to return a Promise
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(console.log(event)); //Ensure to return a Promise
});

self.addEventListener('message', event => {
    //Take messages and take actions for:
    //skipWaiting
    //user interractions
})

self.addEventListener('fetch', event => {
    console.log(event);
});