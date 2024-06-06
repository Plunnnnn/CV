const container = document.getElementById('history');
function wait(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }
 
fetch('/loading.json')
    .then((response) => response.json())
    .then((loadingMessages) => {
         
        load(loadingMessages);
    })
    .catch((error) => {
        console.error('error', error);
    });

    
    function load(messages) {
        writeMessage(container, messages, 0, 0, 5);
    }
    
    function writeMessage(container, messages, index, totalDelay, delay) {
        if (index < messages.length) {
            const message = document.createElement('p');
            container.appendChild(message);
            scrollToBottom()
            writeSingleMessage(message, messages[index], 0, delay);
            totalDelay += delay;
            setTimeout(() => {
                writeMessage(container, messages, index + 1, totalDelay, delay);
            }, delay * messages[index].length);
            

        }
    }
    
    function writeSingleMessage(element, message, index, delay) {
        if (index < message.length) {
            const strongElement = document.createElement('strong');
            strongElement.textContent = message.charAt(index);
            element.appendChild(strongElement); 
            setTimeout(() => {
                writeSingleMessage(element, message, index + 1, delay);
            }, delay);
        }
    }

    function scrollToBottom() {
        const output = document.getElementById('history');
        output.scrollBy({ top: 10000, left: 0, behavior: "smooth" });
        console.log("scrolled")
        
    }

    function update() {
         
        document.getElementById("text").focus();
        
        
        requestAnimationFrame(update);
    }
    
 
    update();

    let prefix;
    let commandlist

    const messageInput = document.getElementById('text');
    
    fetch('/moi.json')
        .then(response => response.json())
        .then(loadingMessages => {
            explorer = loadingMessages;
            place = "home";
            prefix = `Basmoussent@Server ${place} % `;
        })
        .catch(error => {
            console.error('error', error);
        });
        fetch('/cmdd.json')
        .then(response => response.json())
        .then(commands => {
            commandlist = commands;
        })
        .catch(error => {
            console.error('error', error);
        });
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            send();
        }
    });
    
    function send() {
        const messageInput = document.getElementById('text');
        const message = messageInput.value;
        messageInput.value = '';
        evaluate(message);
        
        scrollToBottom();
    }
    
    function ls(command, dict){
        const commandElement = document.createElement('p');
        container.appendChild(commandElement);
        scrollToBottom();
        
        
        writeSingleMessage(commandElement, prefix+command, 0, 5);

        
        setTimeout(() => {
            load(dict);
        }, command.length * 5);
    }
    function evaluate(command) {
        
        if (command === 'ls') {
            ls(command, explorer[`${place}`])
        
        }else if(command === "cd"){
            
            
            for (let key in commandlist) {
                let value = commandlist[key];
                
                 
                if (typeof value === 'object' && value !== null) {
                     
                    if (Object.values(value).includes(`${place}`)) {
                        place = key
                    }
                }
                
            }
            


        }else if( (true === command in commandlist[`${place}`]) && command !== "cd"){
            console.log(place, explorer[place])
            place = commandlist[place][command];      
            ls(command, explorer[`${place}`])        
        
    }
}