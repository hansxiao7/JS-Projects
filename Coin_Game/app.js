function isTouching(a, b) {
	const aRect = a.getBoundingClientRect();
	const bRect = b.getBoundingClientRect();

	return !(
		aRect.top + aRect.height < bRect.top ||
		aRect.top > bRect.top + bRect.height ||
		aRect.left + aRect.width < bRect.left ||
		aRect.left > bRect.left + bRect.width
	);
}


const addEvents = () =>{
	document.addEventListener('keydown', function(e){
		movePlayer(player, e.key);
	});

}


const player = document.querySelector('#player')
const coin = document.querySelector('#coin')

const eatCoin = () =>{
	const count = document.querySelector('#count')
	if (isTouching(player, coin)){
		const h = window.innerHeight;
		const w = window.innerWidth;
		
		coin.style.left = `${Math.floor(Math.random() * w)}px`;
		coin.style.top = `${Math.floor(Math.random() * h)}px`;

		count.innerText = parseInt(count.innerText) + 1;
	}
}

const movePlayer = (player, move) => {
	const t = extractPos(player.style.top);
	const l = extractPos(player.style.left);
	if (move === "ArrowUp"){
		player.style.top = `${t-50}px`;
	} else if (move === "ArrowDown"){
		player.style.top = `${t+50}px`;
	} else if (move === "ArrowLeft"){
		player.style.left = `${l-50}px`;
		player.style.transform = 'scale(-1,1)';
	} else if (move === "ArrowRight"){
		player.style.left = `${l+50}px`;
		player.style.transform = 'scale(1,1)';
	}
	eatCoin();
}

const extractPos = (pos) =>{
	if (!pos) return 0;
	return parseInt(pos.slice(0, -2));
}


addEvents();