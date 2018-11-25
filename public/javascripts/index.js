$(document).ready(function(){
    $("#btn-shorter").click(function(){
        var $this = $(this);
        $this.button('loading');
        $.post("do",
        {
            url: $('#long-url').val(),
        },
        function(data,status){
            console.log(data);
            $('#short-url').html(data.short_url);
            $('#short-url').removeClass("hidden");
            $this.button('reset');
        });
    });
});