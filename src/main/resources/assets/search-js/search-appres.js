(function() {
    function init() {
        $('#searchbar').submit(update);
        $('#fasettform').submit(update);
        $('#sort').submit(update);
        $('input[name=s]').on('change', function() {
            $(this.form).submit();
        });
        $('.svart').on('change', function () {
            setC(1);
            $(this.form).submit();
        });
        $('input[name=f]').on('change', function () {
            setC(1);
            $('.wic').prop('checked', false);
            $(this.form).submit();
        });
        $('.wic').on('change', function () {
            setC(1);
            $(this.form).submit();
        });
        $('input.defaultFasett').on('change', function () {
            setC(1);
            $('.wic').prop('checked', false);
            $(this.form).submit();
        });

        var flere = $('#flere');
        if (flere) {
            flere.on('click', function() {
                var i = $('input[name=c]');
                var v = Number(i.val());
                i.val(v + 1);
                $('#fasettform').submit();
            });
        }


    }
    init();
    function setC(n) {
        $('input[name=c]').val(n);
    }
    function update(e) {
        console.log(e);
        var th = $(this);
        e.preventDefault();
        console.log(th.serialize());
        $.ajax({
            type: th.attr('method'),
            url: th.attr('action'),
            data: th.serialize(),
            success: function (data) {

                window.history.pushState(null, window.title, location.origin + location.pathname + '?' + th.serialize());
                $('#sres').html(data);
                init();
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
})();
