Crypto Lottery
==============

When a jury is chosen in a court of law, the one who does the
selection can affect the verdict.

When playing cards, the dealer can favor certain players and hinder
others.

When there is a lottery, the one who announces results can choose the
winner.

> Quis custodiet ipsos custodes? - *but who watches the watchmen?*

These are the watchmen that guard randomness. We meet them in many
everyday occasions - when we draw lots, play games, engage in
politics, law or economy. We trust them because we have no
other options. This trust is a source of corruption and there seems to
be no way around it. When we choose someone else - he can be no better.
Nature of people can't be changed - but we can create better tools to
facilitate responsibility and prevent cheating.

*Crypto Lottery is a P2P algorithm that allows group of people to randomly choose result.*

How does it work?
---

![Crypto Lottery explanation](https://github.com/mafik/crypto-lottery/raw/master/explanation.png "Crypto Lottery explanation")

How can I use it?
---

Instead of designating anyone to be the *watchmen*, implement your own P2P Crypto Lottery.

If you don't know how, hire me: ["Marek Rogalski" marek@mrogalski.eu](mailto:marek@mrogalski.eu).

Here are some tips if you decide to implement Crypto Lottery yourself:

**Use secure hash** - most common SHA1, seems to be dangerously close to being broken. Use most recent and secure hash (i.e. SHA3).

**Add salt when hashing** - this way you will avoid memorization attacks (very easy to perform if there are few options to choose from).

**Combine numbers using XOR or modulo addition** - this way one honest participant is enough to guarantee random results (perpertators can't cooperate to cheat him). If everyone cheats - they probably don't want to use Crypto Lottery.

Also feel free to use code from this site but remember that it was released under *GNU Affero* with a few parts under various other licenses.
