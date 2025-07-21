import { useState, useRef, useEffect, FC } from "react";
import * as echarts from "echarts";
import { useNavigate } from "react-router-dom";

const StatsDashboardPage: FC = () => {
  const navigate = useNavigate();
  // 사이드바 토글 상태
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // 관리자 드롭다운 상태
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 차트 참조
  const revenueChartRef = useRef<HTMLDivElement>(null);
  const categoryChartRef = useRef<HTMLDivElement>(null);
  const orderTimeChartRef = useRef<HTMLDivElement>(null);
  const userActivityChartRef = useRef<HTMLDivElement>(null);
  // 필터 상태
  const [periodFilter, setPeriodFilter] = useState("month");
  // 사이드바 토글
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  // 관리자 드롭다운 토글
  const toggleAdminDropdown = () => {
    setShowAdminDropdown(!showAdminDropdown);
  };
  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAdminDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // 차트 초기화
  useEffect(() => {
    const resizeHandlers: (() => void)[] = [];

    // 매출 추이 차트
    if (revenueChartRef.current) {
      const revenueChart = echarts.init(revenueChartRef.current);
      const revenueOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}만원",
          },
        },
        series: [
          {
            name: "2024년",
            type: "line",
            stack: "총액",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(58, 130, 246, 0.6)" },
                { offset: 1, color: "rgba(58, 130, 246, 0.1)" },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              width: 3,
              color: "#3b82f6",
            },
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: "#3b82f6",
            },
            data: [
              820, 932, 901, 934, 1290, 1330, 1320, 1450, 1520, 1600, 1650,
              1700,
            ],
          },
          {
            name: "2023년",
            type: "line",
            stack: "총액",
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              width: 2,
              color: "#9ca3af",
              type: "dashed",
            },
            symbol: "circle",
            symbolSize: 6,
            itemStyle: {
              color: "#9ca3af",
            },
            data: [
              620, 732, 701, 734, 1090, 1130, 1120, 1250, 1320, 1400, 1450,
              1500,
            ],
          },
        ],
      };
      revenueChart.setOption(revenueOption);
      const handleResize = () => revenueChart.resize();
      window.addEventListener("resize", handleResize);
      resizeHandlers.push(() =>
        window.removeEventListener("resize", handleResize)
      );
    }
    // 카테고리별 매출 분포 차트
    if (categoryChartRef.current) {
      const categoryChart = echarts.init(categoryChartRef.current);
      const categoryOption = {
        animation: false,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}만원 ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
          data: ["의류", "전자기기", "식품", "가구", "화장품", "기타"],
        },
        series: [
          {
            name: "카테고리별 매출",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "의류" },
              { value: 735, name: "전자기기" },
              { value: 580, name: "식품" },
              { value: 484, name: "가구" },
              { value: 300, name: "화장품" },
              { value: 200, name: "기타" },
            ],
            color: [
              "#3b82f6",
              "#60a5fa",
              "#93c5fd",
              "#bfdbfe",
              "#dbeafe",
              "#f0f9ff",
            ],
          },
        ],
      };
      categoryChart.setOption(categoryOption);
      window.addEventListener("resize", () => {
        categoryChart.resize();
      });
    }
    // 시간대별 주문 현황 차트
    if (orderTimeChartRef.current) {
      const orderTimeChart = echarts.init(orderTimeChartRef.current);
      const orderTimeOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}건",
            },
          },
        ],
        series: [
          {
            name: "주문 건수",
            type: "bar",
            barWidth: "60%",
            data: [
              { value: 120, itemStyle: { color: "#bfdbfe" } },
              { value: 200, itemStyle: { color: "#93c5fd" } },
              { value: 450, itemStyle: { color: "#60a5fa" } },
              { value: 580, itemStyle: { color: "#3b82f6" } },
              { value: 620, itemStyle: { color: "#2563eb" } },
              { value: 350, itemStyle: { color: "#1d4ed8" } },
            ],
          },
        ],
      };
      orderTimeChart.setOption(orderTimeOption);
      window.addEventListener("resize", () => {
        orderTimeChart.resize();
      });
    }
    // 사용자 활동 분석 차트
    if (userActivityChartRef.current) {
      const userActivityChart = echarts.init(userActivityChartRef.current);
      const userActivityOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["방문자 수", "페이지뷰", "체류 시간"],
        },
        xAxis: [
          {
            type: "category",
            data: ["월", "화", "수", "목", "금", "토", "일"],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "방문자/페이지뷰",
            min: 0,
            max: 2000,
            interval: 500,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "체류 시간",
            min: 0,
            max: 20,
            interval: 5,
            axisLabel: {
              formatter: "{value}분",
            },
          },
        ],
        series: [
          {
            name: "방문자 수",
            type: "bar",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            itemStyle: { color: "#60a5fa" },
          },
          {
            name: "페이지뷰",
            type: "bar",
            data: [1200, 1320, 1010, 1340, 1900, 2100, 1800],
            itemStyle: { color: "#3b82f6" },
          },
          {
            name: "체류 시간",
            type: "line",
            yAxisIndex: 1,
            data: [8.0, 6.2, 7.3, 9.5, 12.0, 13.2, 10.3],
            lineStyle: {
              width: 3,
              color: "#f59e0b",
            },
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: "#f59e0b",
            },
          },
        ],
      };
      userActivityChart.setOption(userActivityOption);
      window.addEventListener("resize", () => {
        userActivityChart.resize();
      });
    }
    // 컴포넌트 언마운트 시 차트 인스턴스 제거
    return () => {
      resizeHandlers.forEach((handler) => handler());

      if (revenueChartRef.current) {
        echarts.getInstanceByDom(revenueChartRef.current)?.dispose();
      }
      if (categoryChartRef.current) {
        echarts.getInstanceByDom(categoryChartRef.current)?.dispose();
      }
      if (orderTimeChartRef.current) {
        echarts.getInstanceByDom(orderTimeChartRef.current)?.dispose();
      }
      if (userActivityChartRef.current) {
        echarts.getInstanceByDom(userActivityChartRef.current)?.dispose();
      }
    };
  }, []);

  // 사이드바 메뉴 클릭 핸들러들
  const handleDashboardClick = () => {
    navigate("/admin-dashboard");
  };

  const handleUserManageClick = () => {
    navigate("/report-manage");
  };

  const handleProductManageClick = () => {
    navigate("/products");
  };

  const handleStoreManageClick = () => {
    navigate("/store-home");
  };

  const handleReviewManageClick = () => {
    navigate("/reviews");
  };

  const handleStatsDashboardClick = () => {
    navigate("/stats-dashboard");
  };

  const handleSettingsClick = () => {
    navigate("/admin/settings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-1">
        {/* 사이드바 */}
        <aside
          className={`bg-white shadow-sm fixed h-full z-10 transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="h-full overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <a
                onClick={handleDashboardClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-home text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>대시보드</span>}
              </a>
              <a
                onClick={handleUserManageClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-users text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>사용자 관리</span>}
              </a>
              <a
                onClick={handleProductManageClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-shopping-bag text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>상품 관리</span>}
              </a>
              <a
                onClick={handleStoreManageClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-store text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>가게 관리</span>}
              </a>
              <a
                onClick={handleReviewManageClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-star text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>리뷰 관리</span>}
              </a>
              <a
                onClick={handleStatsDashboardClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 cursor-pointer"
              >
                <i className="fas fa-chart-bar text-blue-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>통계 분석</span>}
              </a>
              <a
                onClick={handleSettingsClick}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-cog text-gray-400 group-hover:text-gray-500 mr-3 text-lg"></i>
                {!sidebarCollapsed && <span>설정</span>}
              </a>
            </nav>
          </div>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 페이지 헤더 */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    통계 분석
                  </h1>
                  <nav className="flex mt-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-1 text-sm text-gray-500">
                      <li>
                        <a href="#" className="hover:text-gray-700">
                          홈
                        </a>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-chevron-right text-xs mx-1"></i>
                        <span className="text-gray-700">통계 분석</span>
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                      <span>
                        {periodFilter === "day"
                          ? "일간"
                          : periodFilter === "week"
                          ? "주간"
                          : periodFilter === "month"
                          ? "월간"
                          : "연간"}
                      </span>
                      <i className="fas fa-chevron-down ml-2 text-gray-500 text-xs"></i>
                    </button>
                    <div className="hidden origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <button
                          onClick={() => setPeriodFilter("day")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                        >
                          일간
                        </button>
                        <button
                          onClick={() => setPeriodFilter("week")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                        >
                          주간
                        </button>
                        <button
                          onClick={() => setPeriodFilter("month")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                        >
                          월간
                        </button>
                        <button
                          onClick={() => setPeriodFilter("year")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                        >
                          연간
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-download mr-2"></i>
                    데이터 다운로드
                  </button>
                </div>
              </div>
            </div>

            {/* 주요 지표 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 총 매출 카드 */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">총 매출</h3>
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      ₩ 3,458만
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-500 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-up mr-1"></i>
                        12.5%
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        전월 대비
                      </span>
                    </div>
                  </div>
                  <div className="h-12 flex items-end">
                    <div className="w-2 h-6 bg-blue-200 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-8 bg-blue-300 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-7 bg-blue-400 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-10 bg-blue-500 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-12 bg-blue-600 rounded-sm mx-0.5"></div>
                  </div>
                </div>
              </div>

              {/* 신규 사용자 카드 */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    신규 사용자
                  </h3>
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">1,245명</p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-500 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-up mr-1"></i>
                        8.3%
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        전월 대비
                      </span>
                    </div>
                  </div>
                  <div className="h-12 flex items-end">
                    <div className="w-2 h-5 bg-green-200 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-7 bg-green-300 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-9 bg-green-400 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-8 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-12 bg-green-600 rounded-sm mx-0.5"></div>
                  </div>
                </div>
              </div>

              {/* 주문 건수 카드 */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    주문 건수
                  </h3>
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">2,876건</p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-500 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-up mr-1"></i>
                        5.2%
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        전월 대비
                      </span>
                    </div>
                  </div>
                  <div className="h-12 flex items-end">
                    <div className="w-2 h-8 bg-purple-200 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-6 bg-purple-300 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-9 bg-purple-400 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-7 bg-purple-500 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-12 bg-purple-600 rounded-sm mx-0.5"></div>
                  </div>
                </div>
              </div>

              {/* 방문자 수 카드 */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    방문자 수
                  </h3>
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                    <i className="fas fa-eye"></i>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">15,432명</p>
                    <div className="flex items-center mt-2">
                      <span className="text-red-500 flex items-center text-sm font-medium">
                        <i className="fas fa-arrow-down mr-1"></i>
                        2.1%
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        전월 대비
                      </span>
                    </div>
                  </div>
                  <div className="h-12 flex items-end">
                    <div className="w-2 h-12 bg-amber-200 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-10 bg-amber-300 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-11 bg-amber-400 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-9 bg-amber-500 rounded-sm mx-0.5"></div>
                    <div className="w-2 h-8 bg-amber-600 rounded-sm mx-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 매출 추이 그래프 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      매출 추이
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">2024년</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">2023년</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div ref={revenueChartRef} className="w-full h-80"></div>
                </div>
              </div>

              {/* 카테고리별 매출 분포 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    카테고리별 매출 분포
                  </h3>
                </div>
                <div className="p-4">
                  <div ref={categoryChartRef} className="w-full h-80"></div>
                </div>
              </div>

              {/* 시간대별 주문 현황 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    시간대별 주문 현황
                  </h3>
                </div>
                <div className="p-4">
                  <div ref={orderTimeChartRef} className="w-full h-80"></div>
                </div>
              </div>

              {/* 사용자 활동 분석 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    사용자 활동 분석
                  </h3>
                </div>
                <div className="p-4">
                  <div ref={userActivityChartRef} className="w-full h-80"></div>
                </div>
              </div>
            </div>

            {/* 상세 데이터 테이블 */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  상세 매출 데이터
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="검색어 입력"
                      className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-filter mr-2"></i>
                    필터
                  </button>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-file-excel mr-2"></i>
                    엑셀 다운로드
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        날짜
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        상품명
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        카테고리
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        판매수량
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        매출액
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-06-28
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        프리미엄 티셔츠
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        의류
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        42
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩ 126만
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          완료
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-06-28
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        스마트 워치
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        전자기기
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩ 375만
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          완료
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-06-27
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        유기농 과일 세트
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        식품
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        28
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩ 84만
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          완료
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-06-27
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        모던 소파
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        가구
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩ 250만
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          배송중
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-06-26
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        프리미엄 스킨케어 세트
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        화장품
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        12
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩ 144만
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          완료
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  총 <span className="font-medium">253</span>개 항목 중{" "}
                  <span className="font-medium">1</span>-
                  <span className="font-medium">5</span> 표시
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                    이전
                  </button>
                  <button className="px-3 py-1 border border-blue-500 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 !rounded-button whitespace-nowrap cursor-pointer">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                    3
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                    다음
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 푸터 */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 E-Commerce + 커뮤니티 채팅 서비스. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                이용약관
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                개인정보처리방침
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                고객센터
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StatsDashboardPage;
