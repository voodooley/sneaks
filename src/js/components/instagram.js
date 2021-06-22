console.log('instagram')
const insta = document.querySelector('.instagram__content')
;(function () {
  new InstagramFeed({
    username: 'voodooley',
    display_profile: false,
    display_biography: false,
    display_gallery: true,
    display_captions: true,
    callback: function (data) {
      let instaArray = data.edge_owner_to_timeline_media.edges
      console.log(instaArray)
      const newArray = instaArray.slice(1, 5)
      console.log(newArray)

      for (let item of newArray) {
        console.log(item.node)
        let element = item.node
        insta.insertAdjacentHTML(
          'afterbegin',
          `
          <article class="instagram__item">
            <a href="https://www.instagram.com/p/${element.shortcode}/" target="_blank">
              <img src="${element.thumbnail_src}"
                alt="${element.accessibility_caption}">
            </a>
          </article>
        `
        )
      }
    },
    styling: false,
  })
})()
