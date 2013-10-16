define(['text!templates/upload.html'], function(uploadTemplate) {
  var uploadView = Backbone.View.extend({
    el: $('#content'),
    events: {
        "submit form": "upload"
        },

        upload: function () {
            $.post('/upload', {
                message: $('input[name=message]').val()
            }, function (data) {
                $("#error").text('Message sent');
                $("#error").slideDown(3000);
            }).error(function () {
                $("#error").text('Unable to send message.');
                $("#error").slideDown(3000);
            });
            return false;
        },

    render: function() {
      this.$el.html(uploadTemplate);
    }
  });

  return uploadView;
});
