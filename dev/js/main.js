
class MainEventBus {
    constructor(){
        const _ = this;
        _.subs = {};
    }
    add(eventName,fn){
        const _ = this;
        if(!(_.subs[eventName])){
            _.subs[eventName] = [];
        }
        _.subs[eventName].push(fn);
    }
    trigger(eventName,data = '') {
        const _ = this;
        if(_.subs[eventName]){
            for(let i = 0; i < _.subs[eventName].length; i++){
                _.subs[eventName][i](data)
            }
        }
    }
}
class Modaler {
    constructor(){
        const _ = this;
        _.content = '';
        _.contentType = 'string';
        _.animType = 1;
        _.tweenFrom = {scale:.5,opacity:0};
        _.tweenTo = {scale:1,opacity:1};
    }
    clickHandler(e){
        const _ = this;
        let target = e.target;
        if((target == _.span) || (target == _.span2)){target = target.parentElement;}
        if((target == _.cont) || (target == _.modalerCloseBtn)){_.close();}
    }
    async createContTpl(){
        const _ = this;
        _.body = document.querySelector('core-body');
        _.cont = document.createElement('CORE-MODALER');
        _.innerCont = document.createElement('CORE-MODALER-INNER');
    }
    async showModal(data){
        const _ = this;
        if(document.querySelector('.form-cont')) return;
        if(!data.content){data.content = 'Идите нахуй, мы вас не звали'}
        if(!data.contentType){data.contentType = _.contentType}
        if(data.contentType == 'string'){
            _.innerCont.innerHTML = data.content;
        }
        if(!data.animType){data.animType = _.animType}
        if(data.animType == 2){
            _.tweenFrom = {y:-300,opacity:0};
            _.tweenTo = {y:0,opacity:1};
        } else if (data.animType == 2){

        }
        _.modalerCloseBtn = document.createElement('BUTTON');
        _.span = document.createElement('SPAN');
        _.span2 = document.createElement ('SPAN');
        _.modalerCloseBtn.className = 'close';
        _.modalerCloseBtn.append(_.span,_.span2)
        _.innerCont.append(_.modalerCloseBtn);
        _.cont.append(_.innerCont);
        _.body.append(_.cont);
        TweenMax.fromTo(_.innerCont,.35,_.tweenFrom,_.tweenTo);
        TweenMax.fromTo(_.cont,.35,{opacity:0},{opacity: 1});
    }
    async close(){
        const _ = this;
        let tl = new TimelineMax();
        tl.add(TweenMax.to(_.innerCont,.15,{scale:1.3})).add(TweenMax.to(_.innerCont,.35,{scale:0,opacity:0}));
        TweenMax.fromTo(_.cont,.35,{opacity:1},{opacity: 0});
        setTimeout(function () {
            _.cont.remove();
        },500)
    }
    init(data){
        const _ = this;
        _.createContTpl();
        _.showModal(data)
    }
}
let mainEventBus = new MainEventBus(),
    modaler = new Modaler();


mainEventBus.add('showModal',modaler.init.bind(modaler));


document.addEventListener('click',modaler.clickHandler.bind(modaler));


let button = document.querySelector('.button');
button.onclick = function() {
    mainEventBus.trigger('showModal', {
        content : '<form>\n' +
    '              <input class="form-input name" type="text" placeholder="Ваше имя">\n' +
    '              <input class="form-input phone" type="tel" placeholder="Телефон">\n' +
    '              <input class="form-input mail" type="email" placeholder="E-mail">\n' +
    '              <input class="form-input pass" type="password" placeholder="Пароль">\n' +
    '              <button class="submit" type="button">Подтвердить</button>\n' +
    '              </form>',
        animType : 2
    });
};
