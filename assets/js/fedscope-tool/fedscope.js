$(function() {
  tooltipModuleDraw = tooltipModule().draw;
  tooltipModuleRemove = tooltipModule().remove;
  treemapModuleDraw = treemapModule().draw;
  mapModuleDraw = mapModule().draw;
  barchartModuleDraw = barchartModule().draw;
  const {
    loadEmployeeCountData,
    loadEmployeeSalaryData,
    loadStates,
    loadAgencies,
    loadOccupationCategories,
    mem
  } = dataModule();

  $("select.dropdown").dropdown();

  loadStates(states => {
    loadAgencies(agencies => {
      loadOccupationCategories(occupationCategories => {
        loadEmployeeCountData([mapModuleDraw, barchartModuleDraw], {
          states,
          agencies,
          occupationCategories,
          tooltipModuleDraw,
          tooltipModuleRemove
        });

        loadEmployeeSalaryData([treemapModuleDraw], {
          agencies
        });

        const stateDropdownOptions = Object.values(states).map(
          s => `<option value="${s.abbreviation}">${s.name}</option>`
        );
        $("#stateDropdown").append(...stateDropdownOptions);

        const agencyDropdownOptions = Object.values(agencies).map(
          a => `<option value="${a.id}">${a.name}</option>`
        );
        $("#agencyDropdown").append(...agencyDropdownOptions);
      });
    });
  });

  $("#mapToolbar").submit(e => {
    e.preventDefault();

    const agencies = $("#agencyDropdown").val();
    const { employeeCounts, states, occupationCategories } = mem;
    let newData = [...employeeCounts];

    if (agencies.length) {
      newData = employeeCounts.filter(e =>
        agencies.some(a => e.agencyId === +a)
      );
    }

    mapModuleDraw(newData, { states, occupationCategories });
  });

  $("#barchartToolbar").submit(e => {
    e.preventDefault();

    const states = $("#stateDropdown").val();
    const { employeeCounts, agencies, occupationCategories } = mem;
    let newData = employeeCounts;

    if (states.length) {
      newData = employeeCounts.filter(e =>
        states.some(s => e.stateAbbreviation === s)
      );
    }

    barchartModuleDraw(newData, { agencies, occupationCategories });
  });
});
