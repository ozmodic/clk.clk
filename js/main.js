$(document).ready(function() {
  var Game = function() {
	this.count = 0
	this.title = "clk.clk - incremental"
	this.counter = $("#count")
	this.up = $("#upgrades")
	this.stats = $("#stats")
	this.cps = 0
	this.upgrades = [
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
		 
	this.cpc = 1
	this.offset = 0.25
	this.interval = 0
	this.button = $(".increment")

	this.updatePrices = function() {
		game = this
		$(".price").each(function(idx,val) {
			//console.log("updating price for ", idx)
			//console.log("price: ", game.upgrades[idx])
			//console.info(this)
			$(this).text(game.upgrades[idx].price.toFixed(2))
		})
	}
	this.updateCount = function(amount) {
		if(amount == undefined) {
			this.count += this.cpc
		} else {
			this.count = amount
		}
		document.title = this.title + "(" + this.count.toFixed(2) + ")"
		this.counter.text(this.count.toFixed(2))
	}	
	this.updateStats = function updateStats() {
		$("#cpc",this.stats).text(this.cpc)
		$("#cps",this.stats).text(this.cps)
	}
	this.init = function() {
		this.counter.text(this.count)
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
			game.count += (game.cps / (1000/time))
			game.updateCount(game.count)
		}
	}
	this.makeUpgrades = function() {
		game = this
		this.upgrades.forEach(function(upgrade, idx) {
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
				if(upgrade.price > game.count) {
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
							game[target] += modifier[target]
							//console.log("new game[target]", game[target])
						}
					}
					game.count -= upgrade.price
					//console.log("click debug")
					offset = game.upgrades[idx].price * game.offset
					//console.log("idx: ",idx)
					//console.log("game.upgrades[idx]")
					//console.info(game.upgrades[idx])
					//console.log("preis")
					//console.info(price)
					game.upgrades[idx].price += offset
					game.updatePrices()
					game.updateStats()
					game.updateCount(game.count)
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
