import {MainEventBus} from './MainEventBus.lib.js';


class Modaler {
    constructor(){
        const _ = this;
        MainEventBus.add('Modaler','showModal', _.show.bind(this));
        MainEventBus.add('Modaler','closeModal', _.close.bind(this));
    }
    clickHandler(e){
        const _ = this;
        let target = e.target;
        while(target !== document.querySelector('body')){
            target.getAttribute('data-click-action');
            if(target.getAttribute('data-click-action')){
                MainEventBus.trigger('Modaler',target.getAttribute('data-click-action'),{
                    content : `<form class="form">
            <input class="form-input name" type="text" placeholder="Ваше имя">
            <input class="form-input phone" type="tel" placeholder="Телефон">
            <input class="form-input mail" type="email" placeholder="E-mail">
            <input class="form-input pass" type="password" placeholder="Пароль">
            <button class="submit" type="button">Подтвердить</button>
          </form>`,
                    contentType : 'layout',
                    closeBtn : '.close',
                    animType : 1,
                    coordinates : {}
                });
            }
            if(target === document.querySelector('core-modaler-inner')) break;
            target = target.parentElement;
        }
    }
    //Создает контейнер для модального окна
    createContTpl(){
        const _ = this;
        _.body = document.querySelector('core-body');
        _.cont = document.createElement('CORE-MODALER');
        _.cont.setAttribute('data-click-action','closeModal');
        _.contStyle = document.createElement('STYLE');
        _.innerCont = document.createElement('CORE-MODALER-INNER');
        _.cont.append(_.innerCont);
        _.body.append(_.contStyle);
        _.body.append(_.cont);
    }
    //Создает кнопку закрытия модального окна
    createButtonTpl(modalerData){
        const _ = this;
        _.modalerCloseBtn = document.createElement('CORE-MODALER-CLOSE');
        _.modalerCloseBtn.setAttribute('data-click-action','closeModal');
        _.closeStyle = document.createElement('STYLE');
        _.cont.append(_.closeStyle);
        if((modalerData.closeBtn === undefined) || (modalerData.closeBtn === true)) {
            _.span = document.createElement('SPAN');
            _.span2 = document.createElement('SPAN');
            _.modalerCloseBtn.append(_.span, _.span2);
        } else if (typeof modalerData.closeBtn === "string"){
            if(modalerData.closeBtn[0] !== '.'){
                _.modalerCloseBtn.innerHTML = modalerData.closeBtn;
            } else {
                let clone = document.querySelector(modalerData.closeBtn).cloneNode(true);
                _.modalerCloseBtn.append(clone);
                _.modalerCloseBtnClone = clone;
            }
        } else if (typeof modalerData.closeBtn == "object"){
            let clone = modalerData.closeBtn.cloneNode(true);
            _.modalerCloseBtn.append(clone);
        }
        else return;
        _.cont.append(_.modalerCloseBtn);
        _.modalerCloseBtnParams = _.modalerCloseBtn.getBoundingClientRect();
    }
    //Присваивает стили
    modalerStyles(modalerData){
        const _ = this;
        let
            innerWidth = '300',
            popup = `
                min-height:100px;
                display:flex;
                justify-content:center;
                align-items:center;
                padding:30px
            `;
        if(modalerData.contentType === 'layout'){
            innerWidth = _.innerCont.childNodes[0].offsetWidth ;
            if(innerWidth > (screen.availWidth - 20)) innerWidth = (screen.availWidth - 20);
            popup = '';
        }
        let top = modalerData.coordinates.top || '100px',
            right = modalerData.coordinates.right || 'auto',
            left = modalerData.coordinates.left || 'auto';
        _.contStyle.textContent = `
            core-modaler {
                width:100%;
                height:100vh;
                overflow:hidden;
                position:fixed;
                z-index:100;
                background-color:rgba(0,0,0,0.5);
                top:0;
                right:0;
                left:0;
            }
            core-modaler-inner {
                width:${innerWidth}px;
                overflow:auto;
                display: block;
                background-color:#fff;
                margin-top:${top};
                margin-left:${left};
                margin-right:${right};
                ${popup};
            }
        `;
        if(modalerData.closeBtn !== false) {
            let btnWidth = 25,
                btnHeight = 25;
            if(modalerData.closeBtn !== "boolean"){
                btnWidth = _.modalerCloseBtnClone.offsetWidth;
                btnHeight = _.modalerCloseBtnClone.offsetHeight;
            }
            let btnX = _.innerCont.getBoundingClientRect().x + innerWidth - (btnWidth / 2),
                btnY = _.innerCont.getBoundingClientRect().y - (btnHeight / 2);
            if(innerWidth === (screen.availWidth - 20)){
                btnX = screen.availWidth - btnWidth;
            }
            let closeCont = `core-modaler-close {
                    width:${btnWidth}px;
                    height:${btnHeight}px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                    border-radius: 100%;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    cursor: pointer;
                    position: absolute; 
                    top: ${btnY}px; 
                    left: ${btnX}px;
                }`,
                closeContSpan = `core-modaler-close span {
                    width:1px;
                    height:15px;
                    display: block;
                    background-color: #000;
                    transform: rotate(45deg);
                    position: absolute;
                }
                core-modaler-close span:last-child {
                    transform: rotate(-45deg)
                }`;
            _.closeStyle.textContent = closeCont;
            if((modalerData.closeBtn === true) || (modalerData.closeBtn === undefined)){
                _.closeStyle.textContent = closeCont + closeContSpan;
            }
        }
    }
    //Запускает анимацию открытия модального окна на основе принятых данных
    modalAnimationStart(modalerData){
        const _ = this;
        _.animType = modalerData.animType;
        if(!modalerData.animType){_.animType = 1}
        if(_.animType === 1){
            _.tweenFromBegin = {scale:.5,opacity:0};
            _.tweenToBegin = {scale:1,opacity:1};
        } else if (_.animType === 2){
            _.tweenFromBegin = {y:-300,opacity:0};
            _.tweenToBegin = {y:0,opacity:1};
        }
        TweenMax.fromTo(_.innerCont,.35,_.tweenFromBegin,_.tweenToBegin);
        TweenMax.fromTo(_.cont,.35,{opacity:0},{opacity: 1});
    }
    //Запускает анимацию закрытия модального окна на основе принятых данных
    modalAnimationEnd(){
        const _ = this;
        if(_.animType === 1){
            _.tweenFromEnd = {scale:1.3};
            _.tweenToEnd = {scale:0,opacity:0};
        } else if (_.animType === 2){
            _.tweenFromEnd = {y:0,opacity:1};
            _.tweenToEnd = {y:-300,opacity:0};
        }
        let tl = new TimelineMax();
        tl.add(TweenMax.to(_.innerCont,.15,_.tweenFromEnd)).add(TweenMax.to(_.innerCont,.35,_.tweenToEnd));
        TweenMax.fromTo(_.cont,.5,{opacity:1},{opacity: 0})
    }
    //Принимает параметры для вывода частей модульного окна
    showModal(modalerData){
        const _ = this;
        if(!modalerData.content){
            console.log('modalerData.content пустой');
            return;
        }
        if((modalerData.contentType === 'string') || (modalerData.contentType === undefined)){
            _.innerCont.textContent = modalerData.content;
        }
        else if((modalerData.contentType === 'layout')){
            _.innerCont.innerHTML = modalerData.content;
        } else {
            let clone;
            if(modalerData.contentType === 'class'){
                clone = document.querySelector(modalerData.content).cloneNode(true);
            }
            if(modalerData.contentType === 'object'){
                clone = modalerData.content.cloneNode(true);
            }
            clone.style.display = 'block';
            _.innerCont.append(clone);
        }
    }
    //Закрывает модальное окно и применяет анимацию закрытия
    closeModal(){
        const _ = this;
        setTimeout(function () { _.cont.remove(), _.contStyle.remove() },500)
    }
    close(){
        const _ = this;
        _.modalAnimationEnd();
        _.closeModal();
    }
    //Запускает части модального окна
    show(modalerData){
        const _ = this;
        if(document.querySelector('core-modaler')) return;
        else if(modalerData){
            _.createContTpl();
            _.showModal(modalerData);
            _.createButtonTpl(modalerData);
            _.modalerStyles(modalerData);
            _.modalAnimationStart(modalerData);
        } else {
            console.log('modalerData не передан')
        }
    }
}
let modaler = new Modaler();


document.addEventListener('click',modaler.clickHandler);

