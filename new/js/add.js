$(function () {
  const IS_VISIBLE = 'is-visible'

  // Theft form input events
  let theftFormInput = $('.theft-form__input'),
    theftFormLabel = ($this) => {
      return $this.siblings('.theft-form__label')
    }
  theftFormInput.on('focus', function () {
    theftFormLabel($(this)).addClass('is-moved')
  })
  theftFormInput.on('blur', function () {
    let thisVal = $(this).val()
    if (!thisVal) {
      theftFormLabel($(this)).removeClass('is-moved')
    }
  })



  // Custom select
  let cSelectList = $('[data-type="c-select-list"]'),
    cSelectSearch = $('[data-type="c-select-search"]'),
    cSelectCheckbox = cSelectList.find('input[type="checkbox"]'),
    cSelectTagsContainer = $('.c-select__tags'),
    cSelectTagClass = 'c-select-tag',
    dataVal = 'data-val',
    cSelectTagTemplate = (b, a) => {
      return `<div data-val="${b}" class="${cSelectTagClass}">${a}</div>`
    }

  let selectOpener = $('.c-select-opener'),
    selectPanel = $('.c-select-panel'),
    cSelect = $('.c-select'),
    cSelectTimer,
    openedSelectPanel = () => {
      return selectPanel.filter(':visible')
    }


  function createCSelectTag(val, text) {
    cSelectTagsContainer.append(cSelectTagTemplate(val, text))
  }
  function removeCSelectTag(val) {
    $(`.${cSelectTagClass}`).filter(function () {
      if ($(this).attr(dataVal) == val) {
        return this
      }
    }).remove()
  }
  function searchSelectList(target) {
    let thisVal = target.val(),
      thisList = target.siblings(cSelectList),
      thisLabels = thisList.find('label')
    let found = thisLabels.filter(function () {
      if (~$(this).find('span').text().toLowerCase().indexOf(thisVal.toLowerCase())) {
        return this
      }
    })
    thisLabels.show().not(found).hide()
  }

  // Handling events
  cSelectSearch.on('keyup', function () {
    searchSelectList($(this))
  })
  cSelectCheckbox.on('change', function () {
    let thisVal = $(this).val(),
      thisText = $(this).siblings().text()
    if (this.checked) {
      createCSelectTag(thisVal, thisText)
    } else {
      removeCSelectTag(thisVal)
    }
  })

  // Interactions
  function openSelectPanel(el) {
    el.show()
    setTimeout(() => {
      el.addClass(IS_VISIBLE)
    }, 1);
  }
  function closeSelectPanel(el) {
    window.clearTimeout(cSelectTimer)
    el.removeClass(IS_VISIBLE)
    el.find('input[type="text"]').val('').trigger('keyup')
    cSelectTimer = window.setTimeout(function () {
      el.hide()
    }, 240)
  }
  function switchClose(el) {
    let a = el.siblings(selectPanel)
    closeSelectPanel(openedSelectPanel().not(a))
    if (a) {
      if (a.is(':visible')) {
        closeSelectPanel(a)
      } else {
        openSelectPanel(a)
      }
    }
  }

  // Handling events
  cSelect.on('mouseleave', function () {
    let a = $(this).find(selectPanel)
    if (a.is(':visible')) {
      closeSelectPanel(a)
    }
  })

  selectOpener.on('click', function () {
    switchClose($(this))
  })

  $(document).click(function (e) {
    var $target = $(e.target);
    if (!$target.closest(cSelect).length && selectPanel.not(`.${IS_VISIBLE}`)) {
      closeSelectPanel(openedSelectPanel())
    }
  })

  $(window).on('scroll', function () {
    if (selectPanel.not(`.${IS_VISIBLE}`)) {
      closeSelectPanel(openedSelectPanel())
    }
  })

})