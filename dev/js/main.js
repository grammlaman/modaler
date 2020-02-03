
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
    trigger(eventName,data) {
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

    }
    clickHandler(e){
        const _ = this;
        let target = e.target;
        if((target == _.span) || (target == _.span2)){target = target.parentElement;}
        if((target == _.cont) || (target == _.cls)){_.close();}
        if(target == document.querySelector('.button')){
            mainEventBus.trigger('click','<form>\n' +
                '              <input class="form-input name" type="text" placeholder="Ваше имя">\n' +
                '              <input class="form-input phone" type="tel" placeholder="Телефон">\n' +
                '              <input class="form-input mail" type="email" placeholder="E-mail">\n' +
                '              <input class="form-input pass" type="password" placeholder="Пароль">\n' +
                '              <button class="submit" type="button">Подтвердить</button>\n' +
                '            </form>')
        }
    }
    async show(data){
        const _ = this;
        if(document.querySelector('.form-cont')) return;
        _.body = document.querySelector('core-body');
        _.cont = document.createElement('DIV');
        _.miniCont = document.createElement('DIV');
        _.cont.className = 'form-cont';
        _.miniCont.className = 'form-cont-mini';
        _.miniCont.innerHTML = data;
        _.cls = document.createElement('BUTTON');
        _.span = document.createElement('SPAN');
        _.span2 = document.createElement('SPAN');
        _.cls.className = 'close';
        _.cls.append(_.span,_.span2)
        _.miniCont.append(_.cls);
        _.cont.append(_.miniCont);
        _.body.append(_.cont);
        TweenMax.fromTo(_.miniCont,.35,{scale:.5},{scale:1,opacity: 1});
        TweenMax.fromTo(_.cont,.35,{opacity:0},{opacity: 1});
    }
    async close(){
        const _ = this;
        let tl = new TimelineMax();
        tl.add(TweenMax.to(_.miniCont,.15,{scale:1.3}))
            .add(TweenMax.to(_.miniCont,.35,{scale:0,opacity:0}));
        TweenMax.fromTo(_.cont,.35,{opacity:1},{opacity: 0});
        setTimeout(function () {
            _.cont.remove();
        },500)
    }
}
let mainEventBus = new MainEventBus(),
    modaler = new Modaler();
mainEventBus.add('click',modaler.show.bind(modaler));
document.addEventListener('click',modaler.clickHandler.bind(modaler))
