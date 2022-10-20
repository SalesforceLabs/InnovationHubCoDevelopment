({
    initialisePaginator : function(component, event, helper) {
        if(component.get('v.currentButton')){
            component.get('v.currentButton').set('v.variant','neutral');
        }
        var pageSize = component.get('v.pageSize');
        
        var pages = Math.ceil(component.get("v.theIdeas").length / pageSize);
        component.set('v.pageCount',pages);
        console.log('No. of pages: ' + pages);
        var pageArr = [];
        var i;
        for(i = 2; i < pages && i<=3; i++){
            pageArr.push(i);
        }
        component.set('v.lastPage', pages);
        component.set('v.pages', pageArr);
        var ideas = component.get('v.theIdeas');
        ideas = ideas.slice(0,pageSize);
        component.set('v.selectedIdeas',ideas);
        component.find('btn-1').set('v.variant','brand');
        component.set('v.currentButton',component.find('btn-1'));
    },
    
    handlePageChange : function(component, event, helper) {
        //console.log();
        if(component.get('v.currentButton')){
            component.get('v.currentButton').set('v.variant','neutral');
        }
        var pages = Math.ceil(component.get("v.theIdeas").length / component.get("v.pageSize"));
        var pageSize = parseInt(component.get('v.pageSize'));
        var currentPage = parseInt(event.getSource().get("v.value"));
        //component.find(event.getSource().getLocalId()).set('v.variant','success');
        component.set('v.currentPage',currentPage);
        component.set('v.currentButton',event.getSource());
        event.getSource().set("v.variant",'brand')
        var pageArr = [];
        var i;
        //console.log(currentPage + ' - ' + typeof(currentPage));
        for(i = 2; i < pages; i++){
            if(currentPage <= 3 && i<=3){
                pageArr.push(i);
            }
            else if(currentPage == pages && i > (pages-3)){
                pageArr.push(i);
            }
                else if(i < currentPage+2 && i > currentPage-2){
                    pageArr.push(i);
                    //console.log(i + '<' + currentPage+2);
                }
        }
        component.set('v.pages', pageArr);
        var ideas = component.get('v.theIdeas');
        ideas = ideas.slice(((currentPage-1)*pageSize),((currentPage-1)*pageSize)+pageSize);
        console.log(((currentPage-1)*pageSize)+'-to-'+((currentPage-1)*pageSize)+pageSize+'='+ideas.length);
        component.set('v.selectedIdeas',ideas);
        
    },
    
    pageSizeChange : function(component, event, helper){
        component.set('v.pageSize',component.find('select').get('v.value'));
    },
    
    paginatorButtons : function(component, event, helper){
        var action = event.getSource().get("v.value");
        var sign;
        if (action == 'next'){
            //document.getElementsByClassName('slds-button_neutral')[4].click();
            //document.querySelectorAll('[value="3"]')[0].click();
            console.log(component.find('3'));
            
            
        }else{sign='-';}
        
        
    }
})