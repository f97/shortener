$(document).ready(function(){
    $("#btn-shorter").click(function(){
        var $this = $(this);
        $this.button('loading');
        $.ajax({
            type: "POST",
            url: "do",
            data: {
                url: $('#long-url').val(),
            },
            success: function(data){
                console.log(data);
                $('#short-url').html(data.short_url);
                $('#short-url').removeClass("hidden");
                $this.button('reset');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $this.button('reset');
                alert(XMLHttpRequest.responseJSON.message);
                // alert("Wow... " + $('#long-url').val() + " is not a valid url!!!");
            }
          });
    });
});