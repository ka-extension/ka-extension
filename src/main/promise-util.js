function querySelectorAllPromise(elementString, interval = 250, maxTrials = 0) {
	return new Promise((resolve, reject) => {
	    let i = 0;
	    (function find() {
		    var elements = document.querySelectorAll(elementString);
		    if(maxTrials > 0 && i > maxTrials) { reject(new Error(`Could not find ${elementString}`)); }
		    else if(elements.length == 0) { setTimeout(find, interval); }
		    else { resolve(elements); }
		    i++;
	    })();
	});
}

function querySelectorPromise(elementString, interval = 250, maxTrials = 0) {
	return new Promise((resolve, reject) => {
		querySelectorAllPromise(elementString, interval, maxTrials)
			.then(e => resolve(e[0]))
			.catch(reject);
	});
}

function objectNotEmptyTimer(obj, interval = 100) {
    return new Promise((resolve, reject) => {
        (function check() {
            if(typeof obj != "object") { reject(new TypeError(`${obj} is not an object`)); }
            else if(Object.keys(obj).length == 0) { setTimeout(check, interval); }
            else { resolve(obj); }
        })();
    });
}