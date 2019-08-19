const express = require('express');
const router = new express.Router();

// bring data in
const { data } = require('../data/cardsData.json');
const { cards } = data;



router.get('/:id', (req, res) =>{
    const {id} = req.params;
    const {side} = req.query;
    const mytext = cards[id][side];
    const text = {mytext, id, side};
    if(!side){
        return res.redirect('?side=question');
    }else if(side === 'answer'){
            text.sidetoshow = 'question';
            text.sidetoshowDisplay = 'Question';
    }else if(side === 'question'){
            text.sidetoshow = 'answer';
            text.sidetoshowDisplay = 'Answer';
            text.hint = cards[id].hint;
    }
    res.render('cards', text);
});

router.get('/', (req, res)=>{
    const max = cards.length;
    const rand = Math.floor(Math.random() * max);
    res.redirect(`/cards/${rand}`);
});

module.exports = router;