
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
        _.animType = 1;
        _.tweenFromBegin = '';
        _.tweenToBegin = '';
        _.tweenFromEnd = '';
        _.tweenToEnd = '';
    }
    clickHandler(e){
        const _ = this;
        let target = e.target;
        if((target == _.span) || (target == _.span2)){target = target.parentElement;}
        if((target == _.cont) || (target == _.modalerCloseBtn)){mainEventBus.trigger('closeModal',_.closeModal);}
        if(target == document.querySelector('.button'))mainEventBus.trigger('showModal',{
            content : '<form>\n' +
                '              <input class="form-input name" type="text" placeholder="Ваше имя">\n' +
                '              <input class="form-input phone" type="tel" placeholder="Телефон">\n' +
                '              <input class="form-input mail" type="email" placeholder="E-mail">\n' +
                '              <input class="form-input pass" type="password" placeholder="Пароль">\n' +
                '              <button class="submit" type="button">Подтвердить</button>\n' +
                '              </form>',
            animType : 1,
        })
    }
    async createContTpl(){
        const _ = this;
        _.body = document.querySelector('core-body');
        _.contStyle = document.createElement('STYLE');
        _.contStyle.textContent = `core-modaler {width:100%; height:100%; position:fixed; z-index:100; background-color: rgba(0,0,0,0.5); top:0; right:0; left:0;}`;
        _.innerStyle = document.createElement('STYLE');
        _.innerStyle.textContent = `core-modaler-inner {width:300px; position:relative; background-color:#fff;display: block;margin: 100px auto;padding: 50px;}`;
        _.cont = document.createElement('CORE-MODALER');
        _.innerCont = document.createElement('CORE-MODALER-INNER');
        _.cont.append(_.innerStyle);
        _.cont.append(_.innerCont);
        _.body.append(_.contStyle);
        _.body.append(_.cont);
    }
    async createButtonTpl(){
        const _ = this;
        _.modalerCloseBtn = document.createElement('BUTTON');
        _.span = document.createElement('SPAN');
        _.span2 = document.createElement ('SPAN');
        _.modalerCloseBtn.className = 'close';
        _.modalerCloseBtn.append(_.span,_.span2);
    }
    async showModal(data){
        const _ = this;
        if(document.querySelector('.form-cont')) return;
        if(!data.content) return console.log('нет переданных данных');
        if(!data.contentType)data.contentType = 'string';
        if(data.contentType == 'string') _.innerCont.innerHTML = data.content;
        if(!data.closeBtn) data.closeBtn = true;
        if(data.closeBtn != false){
            _.innerCont.append(_.modalerCloseBtn);
        }
    }
    async modalAnimation(data){
        const _ = this;
        if(!data.animType){data.animType = 1}
        if(data.animType == 1){
            _.tweenFromBegin = {scale:.5,opacity:0};
            _.tweenToBegin = {scale:1,opacity:1};
            _.tweenFromEnd = {scale:1.3};
            _.tweenToEnd = {scale:0,opacity:0};
        } else if (data.animType == 2){
            _.tweenFromBegin = {y:-300,opacity:0};
            _.tweenToBegin = {y:0,opacity:1};
            _.tweenFromEnd = {y:0,opacity:1};
            _.tweenToEnd = {y:-300,opacity:0};
        }
        TweenMax.fromTo(_.innerCont,.35,_.tweenFromBegin,_.tweenToBegin);
        TweenMax.fromTo(_.cont,.35,{opacity:0},{opacity: 1});
    }
    async closeModal(){
        const _ = this;
        let tl = new TimelineMax();
        tl.add(TweenMax.to(_.innerCont,.15,_.tweenFromEnd)).add(TweenMax.to(_.innerCont,.35,_.tweenToEnd));
        TweenMax.fromTo(_.cont,.35,{opacity:1},{opacity: 0});
        setTimeout(function () {
            _.cont.remove();
        },500)
    }
    show(data){
        const _ = this;
        _.createContTpl();
        _.createButtonTpl();
        _.showModal(data);
        _.modalAnimation(data);
    }
}
let mainEventBus = new MainEventBus(),
    modaler = new Modaler();


mainEventBus.add('showModal',modaler.show.bind(modaler));
mainEventBus.add('closeModal',modaler.closeModal.bind(modaler));


document.addEventListener('click',modaler.clickHandler.bind(modaler));

