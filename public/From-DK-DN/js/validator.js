
function validator(options){
    function getParent(element,selector){
        while(element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {}
    //Hàm thực hiện
    function validate(inputElement, rule){
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        //Lấy các rules của selector
        var rules = selectorRules[rule.selector];
        //Lặp qua từng rule và kiểm tra
        for(var i=0;i<rules.length;i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        }else{
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        //Xử lý khi submit
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            //Thực hiện lặp qua từng rule và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if (!isValid){
                    isFormValid = false;
                }
            });
            
            if (isFormValid){
                //Trường hợp submit vs javascrip
                if(typeof options.onSubmit ==='function'){
                    
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                var formValues = Array.from(enableInputs).reduce(function(values,input){
                    values[input.name] = input.value;
                    return values;
                },{});
                    options.onSubmit(formValues);
                }
                //Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        //Xử lý lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule){

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector]= [rule.test];
            }

            // selectorRules[rule.selector]= rule.test;

            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement){
                //Xử lý trường hợp blur khỏi input
                inputElement.onblur = function(){
                    validate(inputElement,rule);
                }

                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function (){
                    var selecParent = getParent(inputElement,options.formGroupSelector)
                    var errorElement = selecParent.querySelector('.form-message');
                    errorElement.innerText = '';
                    selecParent.classList.remove('invalid');
                }
            }
        });    
    }
}



//Định nghĩa rules
validator.isRequired = function(selector,message){
    return {
        selector:   selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

validator.isEmail = function(selector,message){
    return{
        selector:   selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email';
        }
    }
}
validator.minLength = function(selector,min,message){
    return{
        selector:   selector,
        test: function(value){
            
            return value.length>= min ? undefined : message || 'Mật khẩu phải từ 6-20 kí tự ';
        }
    }
}
validator.isConfirmed = function(selector,getCofirmValue,message){
    return{
        selector: selector,
        test: function(value){
            return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}

