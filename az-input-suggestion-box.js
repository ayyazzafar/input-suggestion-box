// az_input_suggestion_box plugin start

/*
 * 
 * ### Note: Ajax Response should have this format means data structure is compulsory
 * {data:{id:22323, title:'sometitle'}}
 * 
 */

$.fn.az_input_suggestion_box  = function( options ){


    
    
    var self = this;
    var selector = self.selector;
    
    
    // MAKING options optional
    
    
    if(typeof options!=='object')
    {
        options = {};
    }
    var selector_class = selector.split('.')[1];
    self.settings = $.extend({
        wrap:'<div class="az_input_suggestion_box_wrapper" data-selector="'+selector+'"></div>',
        wrapper_classes: '', 
        success:function(){},
        onclick:function(){},
        excluded_suggestions:[]
        
    }, options);
    // loop
    setTimeout(function(){ // set time out to fix focus issue, because of quickly wrapping it does not write
        self.each(function(){
            var input = $(this);
            var wrapper_created= false;
            // adding restriction for selector, its houdl be only only input type text
            if(!$(this).is('input[type="text"]')  )
            {
                alert('Invalid selector for az Suggestion box.');
                return false;
            }
            else if($(this).closest('.az_input_suggestion_box_wrapper').length>0)
            {
                // if input wrapper is created already
                wrapper_created = true;
                var suggestion_box_wrapper  = $(this).closest('.az_input_suggestion_box_wrapper');
                suggestion_box_wrapper.find('.az_input_suggestion_box').remove();
            }
            else
            {
                // only if wrapper is not created yet
                var suggestion_box_wrapper = input.wrap(self.settings.wrap).parent();
            }
            
            
            
            
            // creating suggestion box
            
            var suggestion_box = $('<div class="az_input_suggestion_box"  style="display:none"></div>');
            
            suggestion_box_wrapper.append(suggestion_box);
            // loading suggestions from the url
            var url = self.settings.suggestions.url;
            var data = {};
            if(typeof self.settings.suggestions.data=='object')
            {
                console.log( self.settings.suggestions.data);
                $.extend(true, data, self.settings.suggestions.data);
            }
            var type    =   "POST";
            
            //alert(JSON.stringify(self.settings.suggestions.data));
            $.ajax({url:url, type:type, data:data}).success(function(response){
                /*
                 * 
                 * ### Note: Response should have this format means data structure is compulsory
                 * data:[{id:22323, title:'sometitle'}]}
                 * 
                 */
                if(response.status)
                {
                    var suggestions = response.data;
                    console.log(self.suggestions);
                    console.log(response);
                    console.log('## Esclude:');
                    console.log(self.settings.suggestions.excluded_suggestions);
                    $.each(suggestions, function(index, suggestion){
                       
                       // Exclude provided suggestions from the result
                       var exclude = self.settings.suggestions.excluded_suggestions.filter( function(excluded_suggestion){
                           if(excluded_suggestion.title==suggestion.title)
                           {
                               return true;
                               
                           }
                       });
                       
                       if(exclude.length){console.log('excluding'); console.log(exclude); return true;};
                        var obj_suggestion = $("<div class='az_input_suggestion' data-id='"+suggestion.id+"'>"+suggestion.title+"</div>");
                        
                        suggestion_box.append(obj_suggestion);
                        
                        obj_suggestion.on('click', function(){
                            self.settings.onclick.call(self, suggestion);
                        });
                        
                    });
                    // show .az_input_suggestion_box_wrapper if there are more than 0 suggestions
                    if(suggestions.length>0)
                    {
                        suggestion_box_wrapper.find('.az_input_suggestion_box').slideDown();
                    }
                    // setting up callbacks
                    self.settings.success.call(self, response);
                    
                }
            }).error(function(e){
               alert('error');
               console.log(e);
            });
            
            
        }); 
    }, 1); // end time out function
    
    
    self.hide_suggestion_box = function(){
        $(self).each(function(){
            var visible_input = $(this);
            var wrapper = $(this).closest('.az_input_suggestion_box_wrapper');
            var suggestion_box = wrapper.find('.az_input_suggestion_box');
            suggestion_box.remove();
        });
    }
}
// az_input_suggestion_box plugin end