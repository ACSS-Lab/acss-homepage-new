Stochastic process나 stochastic differential equation 같은 확률 개념은 무작위 현상의 영향을 받는 시스템을 모델링하는 **핵심 수학 도구**입니다. 제어공학과 인접 분야에서 이런 구조적인 model-based 방법은 해석 가능하고 이론적 근거가 분명해, stability, safety, robustness 같은 성질에 대해 구체적인 보장을 이끌어낼 수 있습니다.

그러나 현실의 많은 불확실한 시스템은 **정확히 모델링하기에는 너무 복잡합니다**<em>("All models are wrong, but some are useful" -- Box, 1976)</em>. 그래서 표현력과 일반화 능력이 뛰어난 AI 기반의 data-driven, 흔히 model-free인 접근이 주목받아 왔습니다. 다만 AI 기반 방법은 양질의 데이터와 상당한 계산량을 필요로 하고, **해석 가능성이 낮아** distribution shift나 고장 상황에서 stability, safety, reliability를 보장하기 어렵습니다.

불확실성 하에서 신뢰할 수 있는 자율 제어와 의사결정을 이루려면 <strong>model-based<em>(structural)</em>와 model-free<em>(data-driven)</em> 사이의 스펙트럼</strong>을 연구하는 것이 중요합니다. 목표는 model-free의 유연성과 model-based의 구조·신뢰성·검증 가능성을 결합하는 것입니다.
