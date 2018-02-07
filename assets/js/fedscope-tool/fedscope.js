$(function() {
  tooltipModuleDraw = tooltipModule().draw;
  tooltipModuleRemove = tooltipModule().remove;
  tooltipModuleMove = tooltipModule().move;
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

  loadStates(states => {
    loadAgencies(agencies => {
      loadOccupationCategories(occupationCategories => {
        loadEmployeeCountData([mapModuleDraw, barchartModuleDraw], {
          states,
          agencies,
          occupationCategories,
          tooltipModuleDraw,
          tooltipModuleRemove,
          tooltipModuleMove
        });

        loadEmployeeSalaryData([treemapModuleDraw], {
          agencies,
          tooltipModuleDraw,
          tooltipModuleRemove,
          tooltipModuleMove
        });

        const stateDropdownOptions = Object.values(states).map(
          s => `<option value="${s.abbreviation}">${s.name}</option>`
        );
        $("#barchartStateDropdown").append(...stateDropdownOptions);

        const agencyDropdownOptions = Object.values(agencies).map(
          a => `<option value="${a.id}">${a.name}</option>`
        );
        $("#mapAgencyDropdown").append(...agencyDropdownOptions);
        $("#barchartAgencyDropdown").append(...agencyDropdownOptions);

        const occupationDropdownOptions = Object.values(
          occupationCategories
        ).map(o => `<option value="${o.id}">${o.name}</option>`);
        $("#mapOccupationDropdown").append(...occupationDropdownOptions);
      });
    });
  });

  $("#mapToolbar").submit(e => {
    e.preventDefault();

    const filterAgencies = $("#mapAgencyDropdown").val();
    const filterOccupations = $("#mapOccupationDropdown").val();
    const { employeeCounts, states, occupationCategories } = mem;
    let newData = [...employeeCounts];

    if (filterAgencies) {
      newData = newData.filter(e =>
        filterAgencies.some(a => e.agencyId === +a)
      );
    }

    if (filterOccupations) {
      newData = newData.filter(e =>
        filterOccupations.some(o => e.occupationCategoryId === +o)
      );
    }

    mapModuleDraw(newData, {
      states,
      occupationCategories,
      tooltipModuleDraw,
      tooltipModuleRemove,
      tooltipModuleMove
    });
  });

  $("#mapToolbarReset").click(e => {
    e.preventDefault();

    $("#mapAgencyDropdown > option").attr("selected", false);
    $("#mapOccupationDropdown > option").attr("selected", false);

    const { employeeCounts, states, occupationCategories } = mem;

    mapModuleDraw([...employeeCounts], {
      states,
      occupationCategories,
      tooltipModuleDraw,
      tooltipModuleRemove,
      tooltipModuleMove
    });
  });

  $("#barchartToolbar").submit(e => {
    e.preventDefault();

    const filterStates = $("#barchartStateDropdown").val();
    const filterAgencies = $("#barchartAgencyDropdown").val();

    const { employeeCounts, agencies, occupationCategories } = mem;
    let newData = employeeCounts;

    if (filterStates) {
      newData = newData.filter(e =>
        filterStates.some(s => e.stateAbbreviation === s)
      );
    }

    if (filterAgencies) {
      newData = newData.filter(e =>
        filterAgencies.some(a => e.agencyId === +a)
      );
    }

    barchartModuleDraw(newData, { agencies, occupationCategories });
  });

  $("#barchartToolbarReset").click(e => {
    e.preventDefault();

    $("#barchartAgencyDropdown > option").attr("selected", false);
    $("#barchartStateDropdown > option").attr("selected", false);

    const { employeeCounts, states, occupationCategories } = mem;

    barchartModuleDraw([...employeeCounts], {
      states,
      occupationCategories,
      tooltipModuleDraw,
      tooltipModuleRemove,
      tooltipModuleMove
    });
  });
});
