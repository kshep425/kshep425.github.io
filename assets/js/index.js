$(document).ready(function () {

    $("#color_my_page_btn").click(function (event) {
        event.preventDefault();
        console.log("Color My Page Clicked")
        //https://github.com/mdn/web-speech-api/blob/master/speech-color-changer/script.js
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
            var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
            var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

        } catch (e) {
            console.error(e);
            $('.no-browser-support').show();
            $('.app').hide();
        } //speech recognition

        let prompts = []
        list_of_colors.forEach(function (color_obj) {
            // var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
            // color_with_space = color_obj.color.replace(rex, '$1$4 $2$3$5');
            prompts.push(color_obj.color.toLowerCase())
        })
        console.log(prompts)
        var grammar = '#JSGF V1.0; grammar prompts; public <color> = ' + prompts.join(' | ') + ' ;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        //recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;


        var clear_response_wait;
        function get_color() {
            console.log("get_color")
            return new Promise(function (resolve) {
                responsiveVoice.speak("What's your favorite color?")
                //$("#dialog").dialog("open");
                //$("#dialog").css("display", "block");

                console.log(new Date)
                clear_response_wait = setInterval(function get_response() {
                    console.log("Start voice recognition " + new Date);
                    recognition.start();
                    recognition.onresult = function (event) {
                        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
                        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
                        // It has a getter so it can be accessed like an array
                        // The [last] returns the SpeechRecognitionResult at the last position.
                        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
                        // These also have getters so they can be accessed like arrays.
                        // The [0] returns the SpeechRecognitionAlternative at position 0.
                        // We then return the transcript property of the SpeechRecognitionAlternative object

                        var last = event.results.length - 1;
                        var prompt = event.results[last][0].transcript;

                        prompt = prompt.toLowerCase().replace(" ", "")
                        console.log("prompt: " + prompt)
                        color_recognized = prompts.includes(prompt)
                        if (color_recognized) {
                            recognition.stop();
                            clearInterval(clear_response_wait);

                            console.log(prompt + " color recognized: " + new Date);

                            background_color = prompt;

                            $("html").css("background-color", background_color)

                            localStorage.setItem("background_color", background_color)

                            load_colors()

                            return resolve("Color Response Recieved")
                        } else if(prompt.includes("help")){
                            show_allowed_colors();
                            clearInterval(clear_response_wait);
                        }
                        else {
                            console.log("Please say a color!" + new Date)
                            responsiveVoice.speak("We did not recognize your response, please say a color to color the page.  For a list of colors say help.")
                            clearInterval(clear_response_wait);
                            return get_color()
                        }

                        console.log('Confidence: ' + event.results[0][0].confidence);
                    } //recognition on result

                }, 2000) // setInterval
                recognition.stop()
            }) // promise
        } //get_color()

        $("#dialog").dialog({
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 0
            },
            hide: {
                effect: "explode",
                duration: 1000
            },
            buttons: {
                Cancel: function(){
                    dialog.dialog("close")
                }

            }
        });

        function show_allowed_colors(){
            console.log("Received Help Command");
            $(".ui-dialog-titlebar-close").text("X");

            $("#dialog").dialog("open");
            let allowed_colors = $("#allowed_colors_list");
            list_of_colors.forEach(function (color_obj) {
                list_item = document.createElement("button")
                $(list_item).attr("id", color_obj.color)

                //$(list_item).attr("href", "#")
                $(list_item).attr("class", "colors")
                const rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
                list_item.textContent = color_obj.color.replace(rex, '$1$4 $2$3$5');
                allowed_colors.append(list_item)
            })
        };

        $("#dialog").click(function select_color(event){
            event.preventDefault()
            console.log(event)
            if (event.target.classList.value === "colors"){
                background_color = event.target.id
                console.log(background_color);
                localStorage.setItem("background_color", background_color)
                load_colors();
                $("#dialog").dialog("close");

            }
        });

        get_color();

    }); //color_my_page_btn click


    function isDark( color ) {
        var match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
        console.log(color, match)
        return ( match[1] & 255 )
             + ( match[2] & 255 )
             + ( match[3] & 255 )
               < 3 * 256 / 2;
    }

    function load_colors(){
        background_color = localStorage.getItem("background_color");
        if(background_color){
            $("html").css("background-color", background_color)
            $("body").css("background-color", background_color)

            font_color = isDark($("html").css("background-color")) ? 'whitesmoke' : 'black';

            console.log("load colors: ", background_color, font_color)

            $("body").css("color", font_color)
            $(".nav-link").css("color", font_color)
            $(".active").css("border-bottom-color", font_color)
            $("#resume_link").css("color", font_color)
            $(".blog_link").css("color", font_color)
            $(".card-body").css("color", background_color)
            $(".card-body").css("background-color", font_color)
            $(".card").css("border", "1px solid " + font_color)
            $(".card-header").css("color", font_color)
            $(".navbar-toggler").css("border", "1px solid " + font_color)
            $(".contact").css("color", background_color)
            $(".contact").css("background-color", font_color)
        }
    }

    load_colors();

}); //document.ready