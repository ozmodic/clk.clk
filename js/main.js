  "use strict";
  var Game = function() {
	this.title = "clk.clk - incremental";
	this.counter = $("#count");
	this.up = $("#upgrades");
	this.stats = $("#stats");
	this.state = {};
	this.state.count = 0;
	this.state.cps = 0;
	this.state.upgrades = [
		{
		  name: "clickr",
		  type: "c",
		  price: 10,
		  meta: {
			description: "makes your click strong!",
			cpc: 1,
			offset: 0.10,
			count: 0
		  }
		},
		{
		  name: "henbane",
		  type: 'c',
		  price: 500,
		  meta: {
			description: "<i>a strangely alluring herb...</i>",
			cpc: 2,
			offset: 0.15,
			count: 0
		  }
		},
		{
		  name: "extracted dph",
		  type: 'c',
		  price: 2500,
		  meta: {
			description: "<b class='blink'>SPIDERS EVERYWHERE</b>",
			cpc: 10,
			offset: 0.2,
			count: 0
		  }
		},
		{
		  name: "auto",
		  type: "s",
		  price: 50,
		  meta: {
			description: "for(;;) { click(); }",
			cps: 1,
			offset: 0.10,
			count: 0
		  }
		},
		{
		  name: "mule",
		  type: "s",
		  price: 500,
		  meta: {
			description: "an unwilling participant",
			cps: 2.5,
			offset: 0.11,
			count: 0
		  }
		},
		{
		  name: "delirious shaman",
		  type: "s",
		  price: 1500,
		  meta: {
			description: "would you like some <i>daturahuasca</i>?",
			cps: 7,
			offset: 0.18,
			count: 0
		  }
		}
	]	
		 
	this.state.cpc = 1;
	this.state.offset = 0.25;
	this.interval = 0;
	this.button = $(".increment");
	this.reset = $("#reset");
	console.info("upgrades",this.state.upgrades)

	this.makeUpgrades = function makeUpgrades() {
		var game = this
		var upgrades = { 
				perClick: game.state.upgrades.filter(function(obj) {
				return obj.type == "c"
					}),
				perSecond: game.state.upgrades.filter(function(obj) {
				return  obj.type == "s"
					})
			};
		console.log("upgrades")
		console.info(upgrades)
		for(var section in upgrades) {
			//console.info(upgrades)
			console.log("section",section)
			for(var upg in upgrades[section]) {
				var upgrade = upgrades[section][upg]
				console.log("upgrade", upgrade)
				//console.log(upgrade)
				//console.log("meta data", upgrade.meta)
				//console.log("upgrd")
				//console.info(upgrade)
				var div = $("<div class='upgrade'>")
				var button = $("<button class='buyUpgrade'>buy</button>")
				var title = $("<div class='name'></div>")
				var desc = $("<div class='desc'></div>")
				//console.info(upgrade)
				$(title).text(upgrade.name)
				var str = "cp"+upgrade.type
				$(desc).html(upgrade.meta.description + "(+" +upgrade.meta[str] + " " + str + ")")
				var price = $("<div class='price'></div>")
				$(price).text(upgrade,price)
					$(button).click({u: upgrade},function(e) {
						var upgrade = e.data.u
						console.log("im in de fukkin button m8")
						var meta = upgrade.meta
					if(upgrade.price > game.state.count) {
						console.info("nuffink doing")
						console.info(upgrade.price, ">", game.state.count)
						//do nothing
					} else {
						//modify values
						//console.log("modifier")
						//console.info(modifier)
						for(var key in meta) {
							var target = ""
							var skip = false
							switch(key) {
								case 'cpc':
								case 'cps':
									target = key
									break
								default:
									skip = true
									break
							}
							if(!skip) {
							//console.log("got target", target)
							//console.log("game[target]", game[target])
							//console.log("modifier[target]: " , modifier[target])
							game.state[target] += meta[target]
							//console.log("new game[target]", game[target])
						}
					}
					game.buy(upgrade.name)
					game.updatePrices()
					game.updateStats()
					game.updateCount(game.state.count)
				}
			
			})
			$(div).append(title).append(desc).append(price).append(button)
			$("."+section,"#upgrades").append(div)
			}
		}
	}
	this.updatePrices = function updatePrices() {
		var game = this;
		console.info(game)
		$(".price").each(function(idx,val) {
			console.log("updating price for ", idx)
			console.log("price: ", game.state.upgrades[idx])
			console.info(this)
			console.log("price",idx,val,game.state.upgrades[idx].price)
			$(this).text(game.state.upgrades[idx].price.toFixed(2))
		})
	}
	this.updateCount = function updateCount(amount) {
		if(amount == undefined) {
			this.state.count += this.state.cpc
		} else {
			this.state.count = amount
		}
		document.title = this.title + "(" + this.state.count.toFixed(2) + ")"
		this.counter.text(this.state.count.toFixed(2))
	}	
	this.resetGame = function() {
		var ask = confirm("are you sure?")
		if(ask) {
			clearInterval(this.interval)
			localStorage.clear('clk.state')
			location.reload()
		}
	}
			
	this.updateStats = function updateStats() {
		$("#cpc",this.stats).text(this.state.cpc)
		$("#cps",this.stats).text(this.state.cps)
	}
	this.init = function init() {
		var state = ""
		if(state = localStorage.getItem("clk.state")) {
			$.extend(this.state,JSON.parse(state))
		}
		this.counter.text(this.state.count)
		//console.info(this.counter)
		//console.info(this.button)
		var game = this
		this.button.click(function() {
			game.updateCount()
		})
		console.log("this",this)
		this.makeUpgrades()
		this.interval = this.makeInterval(10);
		this.reset.click(function() { 
			game.resetGame()
		})
		this.updatePrices()
		this.updateStats()
		setInterval(function() {
			$(".blink").fadeToggle(400)
		}, 400)
	}
	this.makeInterval = function makeInterval(time) {
		return setInterval(this.intervalFunc(time),time)
	}
	this.intervalFunc = function intervalFunc(time) {
		var game = this
		return function() {
			//console.log("interval function")
			//console.log("game.count += ", (game.cps / (1000/time)))
			localStorage.setItem('clk.state',JSON.stringify(game.state))
			console.log(game.state.cps / (1000/time))
			game.state.count += (game.state.cps / (1000/time))
			game.updateCount(game.state.count)
		}
	}
	this.buy = function buy(target) {
		//console.log("click debug")
		//console.log("itarget: ",target)
		//console.log("game.upgrades[idx]")
		console.info(this.state.upgrades)
		for(var u in this.state.upgrades) {
			console.log("hayyy", u)
			if (this.state.upgrades[u].name == target) {
				console.log("targetg",target)
				this.state.count -= this.state.upgrades[u].price
				var offset = this.state.upgrades[u].price * this.state.upgrades[u].meta.offset
				this.state.upgrades[u].price += offset
				this.state.upgrades[u].meta.count++
			} else { }
		}
	      }
	}		
	
$(function(){
	$('html').removeClass('no-js');
	var game = new Game;
	game.init()

})
