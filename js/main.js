$(document).ready(function() {
  var Game = function() {
	this.title = "clk.clk - incremental"
	this.counter = $("#count")
	this.up = $("#upgrades")
	this.stats = $("#stats")
	this.state = {}
	this.state.count = 0
	this.state.cps = 0
	this.state.upgrades = [
		{
	 	  name: "clickr",
		  price: 10,
		  modifier: {
			cpc: 1
		  }
 	 	},
		{
		  name: "auto",
		  price: 50,
		  modifier: {
			cps: 1
		  }
		}
	]
		 
	this.state.cpc = 1
	this.state.offset = 0.25
	this.interval = 0
	this.button = $(".increment")

	this.updatePrices = function() {
		game = this
		$(".price").each(function(idx,val) {
			//console.log("updating price for ", idx)
			//console.log("price: ", game.upgrades[idx])
			//console.info(this)
			$(this).text(game.state.upgrades[idx].price.toFixed(2))
		})
	}
	this.updateCount = function(amount) {
		if(amount == undefined) {
			this.state.count += this.state.cpc
		} else {
			this.state.count = amount
		}
		document.title = this.title + "(" + this.state.count.toFixed(2) + ")"
		this.counter.text(this.state.count.toFixed(2))
	}	
	this.updateStats = function updateStats() {
		$("#cpc",this.stats).text(this.state.cpc)
		$("#cps",this.stats).text(this.state.cps)
	}
	this.init = function() {
		if(state = localStorage.getItem("clk.state")) {
			this.state = JSON.parse(state)
		}
		this.counter.text(this.state.count)
		//console.info(this.counter)
		//console.info(this.button)
		game = this
		this.button.click(function() {
			game.updateCount()
		})
		this.makeUpgrades()
		this.interval = this.makeInterval(100);
		this.updateStats()
	}
	this.makeInterval = function(time) {
		this.interval = setInterval(this.intervalFunc(time),time)
	}
	this.intervalFunc = function(time) {
		game = this
		return function() {
			//console.log("interval function")
			//console.log("game.count += ", (game.cps / (1000/time)))
			localStorage.setItem('clk.state',JSON.stringify(game.state))
			game.state.count += (game.state.cps / (1000/time))
			game.updateCount(game.state.count)
		}
	}
	this.makeUpgrades = function() {
		game = this
		this.state.upgrades.forEach(function(upgrade, idx) {
			//console.log("upgrd")
			//console.info(upgrade)
			div = $("<div class='upgrade'>")
			button = $("<button class='buyUpgrade'>buy</button>")
			title = $("<div class='name'></div>")
			$(title).text(upgrade.name)
			price = $("<div class='price'></div>")
			$(price).text(upgrade.price)
			$(button).click(function() {
				//console.log("upgrade obj")
				//console.info(upgrade)
				modifier = upgrade.modifier
				if(upgrade.price > game.state.count) {
					//do nothing
				} else {
					//modify values
					//console.log("modifier")
					//console.info(modifier)
					for(var key in modifier) {
						target = ""
						switch(key) {
							case 'cpc':
							case 'cps':
								target = key
								break
							default:
								break
						}
						if(target != "") {
							//console.log("got target", target)
							//console.log("game[target]", game[target])
							//console.log("modifier[target]: " , modifier[target])
							game.state[target] += modifier[target]
							//console.log("new game[target]", game[target])
						}
					}
					game.state.count -= upgrade.price
					//console.log("click debug")
					offset = game.state.upgrades[idx].price * game.state.offset
					//console.log("idx: ",idx)
					//console.log("game.upgrades[idx]")
					//console.info(game.upgrades[idx])
					//console.log("preis")
					//console.info(price)
					game.state.upgrades[idx].price += offset
					game.updatePrices()
					game.updateStats()
					game.updateCount(game.state.count)
				}
			})
			$(div).append(title).append(price).append(button)
			$("#upgrades").append(div)
		})
	}
  }

  game = new Game
  game.init()
	
  $('html').removeClass('no-js');

});
