function say(data = 'no data') {
    console.log(data)
}

class MainEventBus {
    constructor(){
        const _ = this;
    }
    add(eventName,fn){
        const _ = this;

    }
    trigger(eventName,data) {
        const _ = this;

    }
}

let mainEventBus = new MainEventBus();


mainEventBus.add('Hello, World',say)
mainEventBus.trigger('Hello, World','oh, my God');
