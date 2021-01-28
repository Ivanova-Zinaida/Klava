const text = `Красота воды заключается в ее
необходимости, цвете и необычности. Вода бывает разная: она умеет красиво переливаться на солнце и дарит большую радость. Вода - самый необходимый ресурс для жизни человека, поэтому нужно уметь наслаждаться ею и всячески оберегать от загрязнений, чтобы будущим поколениям тоже хватило этого ресурса.
Для создания фоторассказа можно использовать изображения морей, озер и океанов, описать их и восхититься величием:
`;

const inputElement = document.querySelector('#input');
const textExample = document.querySelector('#textExample');

let letterId = 1;

let startMoment = null;
let started = false;

let letterCounter = 0;
let letterCounter_error = 0;

let lines = getLines(text);

init();

function init () {
    update(); 
    
    inputElement.focus()

    inputElement.addEventListener('keydown', function(event){
        const currentLineNumber = getCurrentLineNumber();
        const element = document.querySelector('[data-key="' + event.key.toUpperCase() +'"]');
        const currentLetter = getCurrentLetter();
        
        if (event.key !== 'Shift'){
            letterCounter = letterCounter + 1;  
        }
        
        
        if (!started) {
            started = true;
            startMoment = Date.now();
        }
        
        if (event.key.startsWith('F') && event.key.length > 1) {
            return
        }
        
        if(element){
            element.classList.add('hint')  
        }
        const isKey = event.key ===currentLetter.original
        const isEnter = event.key === "Enter" && currentLetter.original
        
        if (isKey || isEnter) {
            letterId = letterId + 1;
            update();
        }
        
        else {
            event.preventDefault()
            if (event.key !== 'Shift') {
                letterCounter_error = letterCounter_error + 1;

                for (const line of lines) {
                    for ( const letter of line) {
                        if (letter.original === currentLetter.original) {
                            letter.success = false
                        }
                    }
                }

                update();
            }
        }
        
        if (currentLineNumber !== getCurrentLineNumber()) {
            inputElement.value = '';
            event.preventDefault()
            
            started = false;
            const time = Date.now() - startMoment;
            document.querySelector('#wordCounter').textContent = Math.round(60000 * letterCounter/ time);
            document.querySelector('#errorProcent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%';
            letterCounter = 0;
            letterCounter_error = 0
        }
    })

    inputElement.addEventListener('keyup', function(event){
        const element = document.querySelector('[data-key="' + event.key.toUpperCase() +'"]')
        if (element) {
            element.classList.remove('hint')    
        }
            
    })
}

function getLines (text) {
    
    const lines = [];
    
    let line = [];
    let idCounter = 0;
    
    for(const originalLetter of text){
        idCounter = idCounter + 1;
        
        let letter =  originalLetter
        
        if (letter === ' ') {
            letter = '°'
        }
        
        if (letter === '\n') {
            letter = '¶\n'
        }
        line.push({
            id:idCounter,
            label: letter,
            original: originalLetter,
            success: true
        });
        
        if (line.length >= 70 || letter === '¶\n') {
           lines.push(line);
           line = [];
        }
    }
    
    if (line.length > 0 ) {
        lines.push(line);
    }
    
    return lines
};

function lineToHtml (line) {
    const divElement = document.createElement('div');
    divElement.classList.add('line');
    for ( const letter of line ) {
        const spanElement = document.createElement('span');
        spanElement.textContent = letter.label
        
        divElement.append(spanElement)
        
        if( letterId > letter.id ) {
           spanElement.classList.add('done') 
        }
        
        else if (!letter.success) {
            spanElement.classList.add('hint')
        }
    }
    return divElement
    
}

function update () {
    textExample.innerHTML = '';
    const currentLineNumber = getCurrentLineNumber();

    for (let i = 0; i < lines.length; i++) {
        const html = lineToHtml(lines[i]);
        textExample.append(html);
        
        if (i < currentLineNumber || i > currentLineNumber + 2) {
            html.classList.add('hidden');
        }
    }
}

function getCurrentLineNumber () {
    for (let i = 0; i < lines.length; i++) {
        for (const letter of lines[i]) {
           if (letter.id === letterId) {
               return i
           } 
        }
    }
}

function getCurrentLetter () {
    for (const line of lines) {
        for (const letter of line) {
            if (letterId === letter.id) {
                return letter
            }
        }
    }
}



