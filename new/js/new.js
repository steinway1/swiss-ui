$(function () {

  function lockBody() {
    setTimeout(function () {
      if (!document.body.hasAttribute('data-body-scroll-fix')) {
        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        document.body.setAttribute('data-body-scroll-fix', scrollPosition);
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + scrollPosition + 'px';
        document.body.style.left = '0';
        document.body.style.width = '100%';
      }
    }, 1);
  }

  function unlockBody() {
    if (document.body.hasAttribute('data-body-scroll-fix')) {
      let scrollPosition = document.body.getAttribute('data-body-scroll-fix');
      document.body.removeAttribute('data-body-scroll-fix');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      window.scroll(0, scrollPosition);
    }
  }


  let headerBackdrop = $('.header-backdrop'),
    headerCatalog = $('.header-catalog'),
    trgCatalog = $('[data-evt="showCatalog"]'), catalogTimer, overTimer

  const HIDDEN = 'is-hidden',
    ACTIVE = 'is-active',
    VISIBLE = 'is-visible'

  // Dropdown
  headerBackdrop.addClass(HIDDEN)
  headerCatalog.addClass(HIDDEN)

  function openHeaderCatalog() {
    clearTimeout(catalogTimer)
    clearTimeout(overTimer)
    lockBody()
    headerBackdrop.add(headerCatalog).show()
    setTimeout(() => {
      headerCatalog.addClass(VISIBLE)
      setTimeout(() => {
        headerBackdrop.addClass(VISIBLE)
      }, 1);
    }, 1);
  }

  function closeHeaderCatalog() {
    overTimer = window.setTimeout(function () {
      unlockBody()
      headerBackdrop.add(headerCatalog).removeClass(VISIBLE)
      catalogTimer = window.setTimeout(function () {
        headerBackdrop.add(headerCatalog).hide()
      }, 450)
    }, 20)
  }

  let allowCatalog = $(window).width() > 991

  if (allowCatalog) {
    trgCatalog.add(headerCatalog).on('mouseenter', function () {
      openHeaderCatalog()
    })
    trgCatalog.add(headerCatalog).on('mouseleave', function () {
      closeHeaderCatalog()
    })
  }


  // Header Search
  let headerSearch = $('.modal-search'),
    trgHeaderSearch = $('[data-evt="toggleSearch"]'),
    headerSearchField = $('.modal-search__form-field')

  function openHeaderSearch() {
    headerSearch.show()
    headerSearchField.focus()
    lockBody()
    setTimeout(() => {
      headerSearch.addClass(VISIBLE)
    }, 1);
  }

  function closeHeaderSearch() {
    headerSearch.removeClass(VISIBLE)
    setTimeout(() => {
      headerSearchField.val('')
      headerSearch.hide()
      unlockBody()
    }, 260);
  }

  function toggleHeaderSearch() {
    if (headerSearch) {
      if (headerSearch.is(':visible')) {
        closeHeaderSearch()
      } else {
        openHeaderSearch()
      }
    }
  }

  trgHeaderSearch.on('click', function () {
    toggleHeaderSearch()
  })

  // Mobile menu
  let headerMenu = $('.m-menu'),
    headerMenuContainer = $('.m-menu__container'),
    trgToggleMenu = $('[data-evt="toggleMenu"]')

  let menuCategories = $('.m-menu__categories'),
    trgToggleMenuCategory = $('[data-menu-evt="brands"]')

  function toggleHeaderMenu() {
    if (headerMenu.css('display') == 'none') {
      lockBody()
      headerMenu.show()
      setTimeout(() => {
        headerMenuContainer.removeClass(HIDDEN)
      }, 1);
    } else {
      unlockBody()
      headerMenuContainer.addClass(HIDDEN)
      setTimeout(() => {
        headerMenu.hide()
      }, 310);
    }
  }

  trgToggleMenu.on('click', function () {
    toggleHeaderMenu()
  })

  function toggleMenuCategory() {
    if (menuCategories.hasClass(HIDDEN)) {
      menuCategories.removeClass(HIDDEN)
    } else {
      menuCategories.addClass(HIDDEN)
    }
  }

  trgToggleMenuCategory.on('click', function () {
    toggleMenuCategory()
  })


  // Filtering 
  let filterBtn = $('.filter-results'),
    allowFilterHide = $(window).width() > 767

  filterBtn.addClass(HIDDEN)

  if (allowFilterHide) {
    $(window).scroll(function () {
      let $this = $(this)
      if ($this.scrollTop() > 200) {
        filterBtn.removeClass(HIDDEN)
      } else {
        filterBtn.addClass(HIDDEN)
      }
    });
  }

  // Filter modal
  let filterSpotHead = $('.filter-spot__header'),
    filterSpotBody = $('.filter-spot__body'),
    filterSpotDd = $('.filter-spot-dd')

  function toggleSpotBody(t) {
    let tBody = t.siblings(filterSpotBody),
      tDd = tBody.find(filterSpotDd)
    if (tBody.is(':visible')) {
      tBody.hide()
      tDd.css('rotate', '0deg')
    } else {
      tBody.show()
      tDd.css('transform', 'rotate(180deg)')
    }
  }

  filterSpotHead.on('click', function () {
    toggleSpotBody($(this))
  })

  let fitlerContainer = $('.modal-filter__container'),
    filterModal = $('.modal-filter'),
    filterModalBackdrop = $('.modal-filter__backdrop'),
    trgDesktopFilter = $('.page-filter-btn'),
    trgMobFitler = $('.filter-results'),
    trgFilterClose = $('.modal-filter-close'),
    filterAttr = 'data-filter-evt'

  // Initial
  fitlerContainer.add(filterModalBackdrop).addClass(HIDDEN)

  function openModalFilter() {
    lockBody()
    filterModal.show()
    setTimeout(() => {
      filterModalBackdrop.removeClass(HIDDEN)
      fitlerContainer.removeClass(HIDDEN)
    }, 1);
  }

  function closeModalFilter() {
    filterModalBackdrop.addClass(HIDDEN)
    fitlerContainer.addClass(HIDDEN)
    setTimeout(() => {
      filterModal.hide()
      closeModalCategories()
      unlockBody()
    }, 350);
  }

  function switchFilterBlock(el) {
    let elAttr = el.attr(filterAttr)
    let visibleBody = filterSpotBody.filter(function () {
      if ($(this).css('display') == 'block') {
        return this
      }
    })
    visibleBody.hide()
    switch (elAttr) {
      case 'brands':
        filterSpotBody.filter('#filterBrands').show()
        break;
      case 'gender':
        filterSpotBody.filter('#filterGender').show()
        break;
      case 'case-material':
        filterSpotBody.filter('#filterCaseMaterial').show()
        break;
      case 'case-diameter':
        filterSpotBody.filter('#filterCaseDiameter').show()
        break;
      default:
        filterSpotBody.filter('#filterBrands').show()
        break;
    }
  }

  let trgToggleBrands = $('[data-filter-evt="toggleBrands"]'),
    filterModalBrands = $('.filter-spot__form-max')

  function openModalCategories() {
    trgToggleBrands.html('Less Brands')
    filterModalBrands.addClass('is-expanded')
  }

  function closeModalCategories() {
    trgToggleBrands.html('More Brands')
    filterModalBrands.removeClass('is-expanded')
  }


  function toggleModalBrands() {
    if (filterModalBrands.hasClass('is-expanded')) {
      closeModalCategories()
    } else {
      openModalCategories()
    }
  }

  trgToggleBrands.on('click', function (e) {
    e.preventDefault()
    toggleModalBrands()
  })

  trgDesktopFilter.add(trgMobFitler).on('click', function () {
    switchFilterBlock($(this))
    openModalFilter()
  })

  trgFilterClose.add(filterModalBackdrop).on('click', function () {
    closeModalFilter()
  })

  // Switch grid/list view
  let resultsCardsHolder = $('.cards-holder'),
    trgSwitchView = $('.switch-view__btn')

  const HOLDER_LIST = 'cards-holder_list-view'

  function holderToggleView(el) {
    let switchAttr = el.attr('data-evt')
    switch (switchAttr) {
      case 'switchList':
        resultsCardsHolder.addClass(HOLDER_LIST)
        break;
      case 'switchGrid':
        resultsCardsHolder.removeClass(HOLDER_LIST)
        break;
    }
  }

  trgSwitchView.on('click', function () {
    trgSwitchView.removeClass(ACTIVE)
    $(this).addClass(ACTIVE)
    holderToggleView($(this))
  })


  // Modal product
  let pModalLogo = $('.quick-modal__logo'),
    pModal = $('.quick-modal'),
    card = $('.sw-card'),
    productContainer = $('.quick__container'),
    qClose = $('.quick-close')

  const LOADING_CLASS = 'is-blink'

  card.on('click', function () {
    lockBody()
    pModal.show()
    pModalLogo.addClass(LOADING_CLASS)
    setTimeout(() => {
      productContainer.show()
    }, 1500);
  })

  qClose.on('click', function () {
    pModal.hide()
    unlockBody()
    setTimeout(() => {
      pModalLogo.removeClass(LOADING_CLASS)
      productContainer.hide()
    }, 1);
  })

  let scrollOffset = 140,
    headerNav = $('.header-nav'),
    prevScrollpos = window.pageYOffset

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > scrollOffset) {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        headerNav.removeClass(HIDDEN)
      } else {
        headerNav.addClass(HIDDEN)
      }
      prevScrollpos = currentScrollPos;
    }
  });
})