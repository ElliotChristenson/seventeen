// seventeen.js
// don't forget to validate at jslint.com

/*jslint devel: true, browser: true */


(function () {
    "use strict";

    // list of all suits (clubs, spades, hearts, diamonds)
    const FULL_SUIT_LIST = ["c", "s", "h", "d"];

    // list of all card numbers (note: no "9" or "face" cards)
    const FULL_NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8];

    // unused GLOBAL variables that you might want to enable
    // ES6 uses the const keyword for actual constants, you can use this!
    const MAX_SCORE = 17;
    const MAX_CARDS = 10;
    const DEALER_STAND = 10;
    const DEFAULT_WAGER = 100;
    const DEFAULT_WALLET = 500;


    // flag proposed by student Oscar Avery
    // to check to make certain that
    // wallet update process is complete
    // before beginning new round
    let WALLET_UPDATING = false;

    // not a constant because this will change
    // not part of "game" or another object
    // because the wallet should last beyond a single game
    let player_wallet = DEFAULT_WALLET;

    //setting a default based on constant above
    let player_wager = DEFAULT_WAGER;

    // shortcut function to select an element by ID!
    function byID(e) {
        return document.getElementById(e);
    }

    // shortcut function that updates the inner HTML
    // of an element if given the element's ID
    function updateByID(element, update) {
        byID(element).innerHTML = update;
    }

    // shortcut function to select an HTML element by "query"
    // e.g. byQ(".blue") would select all elements with the class "blue"
    function byQ(e) {
        return document.querySelectorAll(e);
    }

    // shortcut function to show an element with CSS/JavaScript
    function show(element) {
        element.classList.remove("hidden");
    }

    // shortcut function to hide an element with CSS/JavaScript
    function hide(element) {
        element.classList.add("hidden");
    }

    // global function (so that it lives beyond an individual game)
    // note: update_amount can be negative
    function updateWallet(update_amount) {

        // make sure we account for calling without a numeric value
        update_amount = parseInt(update_amount) || 0;
        let dollar_count = player_wallet;
        player_wallet += update_amount;


        if (player_wallet <= 0) {
            alert("Out of Money! Refilling!");
            player_wallet = DEFAULT_WALLET;
            update_amount = player_wallet;
            dollar_count = 0;
        }
        let wallet_refill = setInterval(function () {
            WALLET_UPDATING = true;
            if (dollar_count === player_wallet) {
                clearInterval(wallet_refill);
                WALLET_UPDATING = false;
                return;
            }

            // probably too clever, but decreases by 1 if
            // update_amount is negative otherwise increases by 1
            dollar_count += Math.sign(update_amount);

            // play sound effect of coins to represent money
            COIN_SOUND.play();

            // display on page the dollars
            updateByID("player_wallet", "$" + dollar_count);
        }, 1);   
    }

    // function that returns a Card object
    function Card(suit, num) {

        // "underscore" variables are often internal variables
        let _num = num; // e.g. 1 = Ace, 2 = 2, etc.
        let _suit = suit; // e.g. h = hearts, d = diamonds, etc.

        // we use this to allow external access via num() and suit();
        let my = {
            num: _num,
            suit: _suit
        };

        // object method that returns the partial path (folder+filename)
        // of the image e.g. "card-images/h1.png = ace of hearts"
        my.fname = function () {
            return "card-images/" + _suit + _num + ".png";
        };

        // a getter/setter method!
        my.num = function (value) {
            if (value === undefined) {
                return _num;
            }
            _num = value;

            return my;
        };

        my.suit = function (value) {
            if (value === undefined) {
                return _suit;
            }
            _suit = value;

            return my;
        };

        // actually returns the object via the called function!
        return my;
    }

    // function that returns a Deck Object
    function Deck() {

        // an array that holds the card objects
        let _cards = [];

        let my = {
            cards: _cards
        };

        my.cards = function (value) {
            if (value === undefined) {
                return _cards;
            }
            _cards = value;

            return my;
        };

        // go through the cards and shuffle them randomly!
        my.shuffle = function () {
            _cards.forEach(function (this_card, this_pos) {

                // switch with randomly selected card
                let card2_pos = Math.floor(_cards.length * Math.random());
                let temp = _cards[card2_pos];
                _cards[card2_pos] = this_card;
                _cards[this_pos] = temp;
            });
        };

        // take the top card off the deck and return the card object!
        my.deal = function () {
            let card_dealt = _cards.pop();
            updateByID("cards_left", _cards.length);
            return card_dealt;
        };

        // create the Deck's cards!
        my.create = function () {
            FULL_SUIT_LIST.forEach(function (suit) {
                FULL_NUM_LIST.forEach(function (num) {
                    let card_to_add = new Card(suit, num);
                    _cards.push(card_to_add);
                });
            });
        };

        return my;
    }

    // function that returns a Game object
    function Game() {

        //create a new deck of cards each game!
        let _deck = new Deck();

        // array that holds the cards the dealer has been dealt
        let _dealer_hand = [];

        // array that holds the cards the player has been dealt
        let _player_hand = [];

        // array that holds the dealer card image elements
        let _dealer_images = byQ("#dealer img");

        // array that holds the player card image elements
        let _player_images = byQ("#player img");

        // the score to be displayed for the dealer
        let _dealer_score = 0;

        // the score to be displayed for the player
        let _player_score = 0;

        // is the dealer's card still hidden?
        let _dealer_hidden = true;

        let my = {
            deck: _deck,
            dealer_hand: _dealer_hand,
            player_hand: _player_hand,
            dealer_images: _dealer_images,
            player_images: _player_images,
            dealer_score: _dealer_score,
            player_score: _player_score,
            dealer_hidden: _dealer_hidden
        };

        my.deck = function (value) {
            if (value === undefined) {
                return _deck;
            }
            _deck = value;

            return my;
        };

        my.dealer_hand = function (value) {
            if (value === undefined) {
                return _dealer_hand;
            }
            _dealer_hand = value;

            return my;
        };

        my.player_hand = function (value) {
            if (value === undefined) {
                return _player_hand;
            }
            _player_hand = value;

            return my;
        };

        my.dealer_images = function (value) {
            if (value === undefined) {
                return _dealer_images;
            }
            _dealer_images = value;

            return my;
        };

        my.player_images = function (value) {
            if (value === undefined) {
                return _player_images;
            }
            _player_images = value;

            return my;
        };

        my.player_score = function (value) {
            if (value === undefined) {
                return _player_score;
            }
            _player_score = value;

            return my;
        };

        my.dealer_score = function (value) {
            if (value === undefined) {
                return _dealer_score;
            }
            _dealer_score = value;

            return my;
        };

        my.dealer_hidden = function (value) {
            if (value === undefined) {
                return _dealer_hidden;
            }
            _dealer_hidden = value;

            return my;
        };

        my.walletMsg = function (msg) {
            updateByID("wallet_message", msg);
        };

        my.gameMsg = function (msg) {
            updateByID("game_message", msg);
        };

        // enable/disable buttons to start/end game
        my.newGameButtons = function (status) {
            if (status !== undefined && typeof status === "boolean") {
                if (!status) {
                    byID("hit_button").disabled = false;
                    byID("stand_button").disabled = false;
                    byID("new_game_button").disabled = true;
                    byID("wager_field").disabled = true;
                } else {
                    byID("hit_button").disabled = true;
                    byID("stand_button").disabled = true;
                    byID("new_game_button").disabled = false;
                    byID("wager_field").disabled = false;
                }
            }
        };

        my.setWinner = function (winner, loser) {
            let wq = "#" + winner + " img";
            byQ(wq).forEach(function (item) {
                item.classList.add("winner");
            });
            let lq = "#" + loser + " img";
            byQ(lq).forEach(function (item) {
                item.classList.add("loser");
            });
        };

        // deal into either player or dealer and check to see if new
        // deck needs to be dealt!
        my.dealDeck = function (hand) {
            if (_deck.cards().length < 1) {
                _deck.create();
                _deck.shuffle();
            }
            switch (hand) {

            case "player":
                _player_hand.push(_deck.deal());
                break;
            case "dealer":
                _dealer_hand.push(_deck.deal());
                break;
            default:
                console.log("illegal call to dealDeck()");
            }
        };

        // setup the game the first time
        my.setup = function () {
            _deck.create();
            _deck.shuffle();
        };

        my.getWager = function () {
            if (Number.isNaN(byID("wager_field").value)) {
                my.walletMsg("ILLEGAL: Setting wager to :" + DEFAULT_WAGER);
                byID("wager_field").value = DEFAULT_WAGER;
            }

            player_wager = parseInt(byID("wager_field").value);

            if (player_wager < 1) {
                my.walletMsg("BID TOO LOW: Wager now $" + DEFAULT_WAGER);
                player_wager = DEFAULT_WAGER;
                byID("wager_field").value = player_wager;
            } else if (player_wager > player_wallet) {
                my.walletMsg("BID TOO HIGH: Wager now $" + player_wallet);
                player_wager = player_wallet;
                byID("wager_field").value = player_wager;
            }
        };

        my.startRound = function () {

            // reset player and dealer scores to 0
            _player_score = 0;
            _dealer_score = 0;

            // reset player and dealer DISPLAYED scores to 0
            updateByID("player_score", _player_score);
            updateByID("dealer_score", _dealer_score);

            // clear player and dealer hands (arrays)
            _dealer_hand = [];
            _player_hand = [];

            _dealer_hidden = true;

            // clear status messages of last game
            my.gameMsg("");

            // remove any leftover winner/loser "glow" class from cards
            byQ("img").forEach(function (image) {
                image.classList.remove("winner");
                image.classList.remove("loser");
            });

            updateByID("player_wallet", "$" + player_wallet);
            

            // get, check and set valid player wager
            my.getWager();

            // sets all dealer images to blank cards
            // tricky because we have to convert _dealer_images
            // into an actual array instead of a "collection"
            Array.from(_dealer_images).forEach(function (item) {
                item.src = "card-images/blank-card.png";
                hide(item);
            });

            // play the sound sample for 4 cards being played
            DEAL_SOUND.play();

            // deals 2 cards for the dealer - first: hidden card
            my.dealDeck("dealer");

            // next: displayed card
            my.dealDeck("dealer");

            _dealer_images[1].src = _dealer_hand[1].fname();
            setTimeout(function () {
                show(_dealer_images[1]);
            }, 500);
            setTimeout(function () {
                show(_dealer_images[0]);
            }, 1000);


            // sets all player images to blank cards
            Array.from(_player_images).forEach(function (item) {
                item.src = "card-images/blank-card.png";
                hide(item);
            });

            // deals 2 cards for the player, displays them both!
            my.dealDeck("player");
            my.dealDeck("player");

            _player_images[0].src = _player_hand[0].fname();
            setTimeout(function () {
                show(_player_images[0]);
            }, 1500);

            // display the 2nd card
            _player_images[1].src = _player_hand[1].fname();
            setTimeout(function () {
                show(_player_images[1]);
            }, 2000);
            setTimeout(function () {
                my.newGameButtons(false);
            }, 2500);
        };

        // pass in a "hand" array - either dealer or player to get total!
        my.addCards = function (hand) {
            let total = 0;
            hand.forEach(function (card) {
                total += card.num();
            });
            return total;
        };

        my.score = function () {
            _dealer_score = my.addCards(_dealer_hand);
            if (_dealer_hidden === true) {

                //remove hidden card from score!
                _dealer_score -= _dealer_hand[0].num();
            }
            updateByID("dealer_score", _dealer_score);

            _player_score = my.addCards(_player_hand);
            updateByID("player_score", _player_score);
        };

        my.hit = function () {

            let hidden_card_images = [];

            // filename for newest image
            let new_img = "";

            // can't go over 10 cards anyway
            // (1 x 4) + (2 x 4) + 3 + 3 = 18 (bust)
            // so "if" is somewhat optional -
            // but good to have if MAX_CARDS changes!
            if (_player_hand.length < MAX_CARDS) {

                // use JS querySelectorAll to get array
                // of all the HIDDEN player cards
                // i.e. to the right of the flipped cards

                hidden_card_images = byQ("#player img.hidden");
                // Call the deal() method on the _deck object
                // then pass that value (a card object) onto the
                // _player_hand array

                my.dealDeck("player");
                CARD_SOUND.play();

                // display the recently added card image!
                new_img = _player_hand[_player_hand.length - 1].fname();
                hidden_card_images[0].src = new_img;

                // IMPORTANT: remove the "hidden" class so that our
                // selector above works again in the game!
                show(hidden_card_images[0]);
            }
        };

        my.stand = function () {

            // local variable, so we can re-use this without
            // issue of above "hit"
            let hidden_card_images = [];

            // filename for newest image
            let new_img = "";

            // explicitly flip over the very first card
            // since it's dealt "face-down"
            new_img = _dealer_hand[0].fname();

            _dealer_images[0].src = new_img;

            // set a flag so we know that the hidden card is now visible
            _dealer_hidden = false;

            my.score();

            // loop until "DEALER_STAND" i.e. 10 is reached by the Dealer
            //
            // can't go over 10 cards anyway
            // (1 x 4) + (2 x 4) + 3 + 3 = 18 (bust)
            // so "if" is somewhat optional
            // good to have if MAX_CARDS changes!

            while (
                ((
                    _dealer_score < DEALER_STAND
                ) && (
                    _dealer_hand.length < MAX_CARDS
                ) && (
                    _dealer_score < _player_score
                )) || ((
                    _player_score < DEALER_STAND
                ) && (
                    _player_score === _dealer_score
                ))
            ) {

                // use JS querySelector to get array
                // of all the HIDDEN player cards
                // i.e. to the right of the flipped cards
                hidden_card_images = byQ("#dealer img.hidden");

                // Call the deal() method on the _deck object
                // then pass that value (a card object) onto the
                // _dealer_hand array
                my.dealDeck("dealer");
                CARD_SOUND.play();

                // update the dealer's score with the new card value
                _dealer_score += _dealer_hand[_dealer_hand.length - 1].num();

                // display the recently added card image!
                new_img = _dealer_hand[_dealer_hand.length - 1].fname();

                hidden_card_images[0].src = new_img;

                // IMPORTANT: remove the "hidden" class so that our
                // selector above works after the first card!
                show(hidden_card_images[0]);
            }
        };

        my.bust = function () {

            // check if the player went over the MAX_SCORE (17)
            if (_player_score > MAX_SCORE) {

                // disable "play" buttons / enable "new" button
                my.newGameButtons(true);

                // add a message explaining the "bust" to the player
                my.gameMsg("BUST! You Lose!");
                my.setWinner("dealer", "player");
                updateWallet(0 - player_wager);
            }
        };

        my.winner = function () {

            // demonstrates "if", "else", and "else if"
            // check whether dealer or player had a higher
            // score - or "draw" (tie) if the scores are equal
            if (_player_score > _dealer_score) {
                my.gameMsg("You Win!");
                my.setWinner("player", "dealer");
                updateWallet(player_wager);
            } else if (_player_score < _dealer_score) {
                my.gameMsg("Dealer Wins!");
                my.setWinner("dealer", "player");
                updateWallet(0 - player_wager);
            } else {
                my.gameMsg("Looks Like a Draw!");
                updateWallet(0);

                // play the "draw" sound
                DRAW_SOUND.play();
            }
            // disable "play" buttons / enable "new" button
            my.newGameButtons(true);
        };
        return my;
    }

    const CARD_SOUND = byID("card-sound");
    const DEAL_SOUND = byID("deal-sound");
    const DRAW_SOUND = byID("draw-sound");
    const COIN_SOUND = byID("coins-sound");

    const GAME = new Game();
    GAME.setup();
    GAME.newGameButtons(true);
    GAME.gameMsg("Start a New Game?");
    updateWallet();

    byID("new_game_button").addEventListener("click", function () {
        if (!WALLET_UPDATING) {
            GAME.walletMsg("");
            GAME.startRound();
            GAME.score();
        }

    });

    byID("hit_button").addEventListener("click", function () {
        GAME.hit();
        GAME.score();
        GAME.bust();
    });

    byID("stand_button").addEventListener("click", function () {
        GAME.stand();
        GAME.score();
        GAME.winner();
    });
}());