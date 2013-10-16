define(['text!templates/index.html'], function (indexTemplate) {
    var indexView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "searchbook"
        },

        searchbook: function () {
            $.post('/searchbook', {
                title: $('input[name=title]').val()
            }, function (data) {
                $("#error").text('');
                var isbn = null;
                var cover = null;
                $.each(data, function (key, val) {
                    if (key == 'Title') {
                        cover = val;
                    }
                    if (key == 'ISBN') {
                        isbn = val;
                    }
                });
                $("#result").text('Title=' + cover + ', ISBN =' + isbn);
                $("#result").slideDown();
            }).error(function () {
                $("#result").text('');
                $("#error").text('No match found.');
                $("#error").slideDown();
            });
            return false;
        },

        render: function () {
            this.$el.html(indexTemplate);
        }
    });

    return indexView;
});
