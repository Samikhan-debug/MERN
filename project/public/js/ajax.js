// Function to fetch and display stories
function displayStories() {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories",
      method: "GET",
      dataType: "json",

      success: function (data) {
        var storiesList = $("#storiesList");
        storiesList.empty();
        
        var row = $('<div class="row"></div>'); // Create a row for the cards
        $.each(data, function (index, story) {
          var cardHtml = `
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">${story.title}</h5>
                  <p class="card-text">${story.content}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary btn-edit" data-id="${story.id}">Edit</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary btn-del" data-id="${story.id}">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
          row.append(cardHtml); // Add the card to the current row
        });
        storiesList.append(row); // Add the row to the storiesList container
      },
      
      error: function (error) {
        console.error("Error fetching stories:", error);
      },
    });
  }

  // Function to delete a story
  function deleteStory() {
    let storyId = $(this).attr("data-id");
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
      method: "DELETE",
      success: function () {
        displayStories(); // Refresh the list after deleting a story
      },
      error: function (error) {
        console.error("Error deleting story:", error);
      },
    });
  }

  function handleFormSubmission(event) {
    event.preventDefault();
    let storyId = $("#createbtn").attr("data-id");
    var title = $("#createtitle").val();
    var content = $("#createcontent").val();
    if (storyId) {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
        method: "PUT",
  
        data: { title, content },
        success: function () {
          displayStories(); // Refresh the list after creating a new story
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    } else {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "POST",
        data: { title, content },
        success: function () {
          displayStories(); // Refresh the list after creating a new story
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    }
  }


  function editBtnClicked(event) {
    event.preventDefault();
    let storyId = $(this).attr("data-id");
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
      method: "GET",
      success: function (data) {
        console.log(data);
        $("#clearbtn").show();
        $("#createtitle").val(data.title);
        $("#createcontent").val(data.content);
        $("#createbtn").html("Update");
        $("#createbtn").attr("data-id", data.id);
      },
      error: function (error) {
        console.error("Error deleting story:", error);
      },
    });
  }


  $(document).ready(function () {
    // Initial display of stories
  
    displayStories();
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editBtnClicked);
    // Create Form Submission
    $("#contactForm").submit(handleFormSubmission);
    $("#clearbtn").on("click", function (e) {
      e.preventDefault();
      $("#clearbtn").hide();
      $("#createbtn").removeAttr("data-id");
      $("#createbtn").html("Create");
      $("#createtitle").val("");
      $("#createcontent").val("");
    });
  });