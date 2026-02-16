# Lipgloss Dependency Tree Summary

**Generated:** 2025-08-20T22:55:31.254Z
**Total Methods:** 210

## Categories

### Basic (Priority 1)

Core API methods - style creation and basic rendering

**Methods:** NewStyle, SetString, Value, Copy, Inherit, Render, UnsetBold, UnsetItalic, UnsetUnderline, UnsetStrikethrough, UnsetReverse, UnsetBlink, UnsetFaint, UnsetForeground, UnsetBackground, UnsetColorWhitespace, UnsetInline, UnsetUnderlineSpaces, UnsetStrikethroughSpaces, UnsetTransform, UnsetString, Size, DefaultRenderer, SetDefaultRenderer, NewRenderer, StyleRunes, StyleRanges, NewRange, WithWhitespaceForeground, WithWhitespaceBackground, WithWhitespaceChars, GetBold, GetItalic, GetUnderline, GetStrikethrough, GetReverse, GetBlink, GetFaint, GetForeground, GetBackground, GetColorWhitespace, GetInline, GetUnderlineSpaces, GetStrikethroughSpaces, GetHorizontalFrameSize, GetVerticalFrameSize, GetFrameSize, GetTransform, ColorWhitespace, UnderlineSpaces, StrikethroughSpaces, Renderer

### Color (Priority 2)

Color management and application

**Methods:** ColorProfile, SetColorProfile, HasDarkBackground, SetHasDarkBackground, Foreground, Background

### Layout (Priority 3)

Dimensions, padding, margins, and alignment

**Methods:** UnsetWidth, UnsetHeight, UnsetAlign, UnsetAlignHorizontal, UnsetAlignVertical, UnsetPadding, UnsetPaddingLeft, UnsetPaddingRight, UnsetPaddingTop, UnsetPaddingBottom, UnsetMargins, UnsetMarginLeft, UnsetMarginRight, UnsetMarginTop, UnsetMarginBottom, UnsetMarginBackground, UnsetMaxWidth, UnsetMaxHeight, UnsetTabWidth, Width, Height, GetWidth, GetHeight, GetAlign, GetAlignHorizontal, GetAlignVertical, GetPadding, GetPaddingTop, GetPaddingRight, GetPaddingBottom, GetPaddingLeft, GetHorizontalPadding, GetVerticalPadding, GetMargin, GetMarginTop, GetMarginRight, GetMarginBottom, GetMarginLeft, GetHorizontalMargins, GetVerticalMargins, GetBorderTopWidth, GetMaxWidth, GetMaxHeight, GetTabWidth, Align, AlignHorizontal, AlignVertical, Padding, PaddingLeft, PaddingRight, PaddingTop, PaddingBottom, Margin, MarginLeft, MarginRight, MarginTop, MarginBottom, MarginBackground, MaxWidth, MaxHeight, TabWidth

### Border (Priority 4)

Border styles and configurations

**Methods:** UnsetBorderStyle, UnsetBorderTop, UnsetBorderRight, UnsetBorderBottom, UnsetBorderLeft, UnsetBorderForeground, UnsetBorderTopForeground, UnsetBorderRightForeground, UnsetBorderBottomForeground, UnsetBorderLeftForeground, UnsetBorderBackground, UnsetBorderTopBackgroundColor, UnsetBorderTopBackground, UnsetBorderRightBackground, UnsetBorderBottomBackground, UnsetBorderLeftBackground, NormalBorder, RoundedBorder, BlockBorder, OuterHalfBlockBorder, InnerHalfBlockBorder, ThickBorder, DoubleBorder, HiddenBorder, MarkdownBorder, ASCIIBorder, GetBorder, GetBorderStyle, GetBorderTop, GetBorderRight, GetBorderBottom, GetBorderLeft, GetBorderTopForeground, GetBorderRightForeground, GetBorderBottomForeground, GetBorderLeftForeground, GetBorderTopBackground, GetBorderRightBackground, GetBorderBottomBackground, GetBorderLeftBackground, GetBorderTopSize, GetBorderLeftSize, GetBorderBottomSize, GetBorderRightSize, GetHorizontalBorderSize, GetVerticalBorderSize, Border, BorderStyle, BorderTop, BorderRight, BorderBottom, BorderLeft, BorderForeground, BorderTopForeground, BorderRightForeground, BorderBottomForeground, BorderLeftForeground, BorderBackground, BorderTopBackground, BorderRightBackground, BorderBottomBackground, BorderLeftBackground

### Styling (Priority 5)

Text styling and transformations

**Methods:** Bold, Italic, Underline, Strikethrough, Reverse, Blink, Faint, Inline, Transform

### Component (Priority 6)

Complex components - tables, lists, trees

**Methods:** NewStringData, NewFilter, NewLeaf, Root, New, DefaultEnumerator, RoundedEnumerator, DefaultIndenter, JoinHorizontal, JoinVertical, Place, PlaceHorizontal, PlaceVertical, DefaultStyles, Alphabet, Arabic, Roman, Bullet, Asterisk, Dash

## Execution Order

Methods should be tested in this order:

1. **NewStyle** (basic) - Creates a new style instance
2. **SetString** (basic) - SetString method
3. **Value** (basic) - Value method
4. **Copy** (basic) - Creates a copy of the style
5. **Render** (basic) - Renders content with applied styles
6. **UnsetBold** (basic) - UnsetBold method
7. **UnsetItalic** (basic) - UnsetItalic method
8. **UnsetUnderline** (basic) - UnsetUnderline method
9. **UnsetStrikethrough** (basic) - UnsetStrikethrough method
10. **UnsetReverse** (basic) - UnsetReverse method
11. **UnsetBlink** (basic) - UnsetBlink method
12. **UnsetFaint** (basic) - UnsetFaint method
13. **UnsetForeground** (basic) - UnsetForeground method
14. **UnsetBackground** (basic) - UnsetBackground method
15. **UnsetColorWhitespace** (basic) - UnsetColorWhitespace method
16. **UnsetInline** (basic) - UnsetInline method
17. **UnsetUnderlineSpaces** (basic) - UnsetUnderlineSpaces method
18. **UnsetStrikethroughSpaces** (basic) - UnsetStrikethroughSpaces method
19. **UnsetTransform** (basic) - UnsetTransform method
20. **UnsetString** (basic) - UnsetString method
21. **Size** (basic) - Size method
22. **DefaultRenderer** (basic) - DefaultRenderer method
23. **SetDefaultRenderer** (basic) - SetDefaultRenderer method
24. **NewRenderer** (basic) - NewRenderer method
25. **NewRange** (basic) - NewRange method
26. **WithWhitespaceForeground** (basic) - WithWhitespaceForeground method
27. **WithWhitespaceBackground** (basic) - WithWhitespaceBackground method
28. **WithWhitespaceChars** (basic) - WithWhitespaceChars method
29. **GetBold** (basic) - GetBold method
30. **GetItalic** (basic) - GetItalic method
31. **GetUnderline** (basic) - GetUnderline method
32. **GetStrikethrough** (basic) - GetStrikethrough method
33. **GetReverse** (basic) - GetReverse method
34. **GetBlink** (basic) - GetBlink method
35. **GetFaint** (basic) - GetFaint method
36. **GetForeground** (basic) - GetForeground method
37. **GetBackground** (basic) - GetBackground method
38. **GetColorWhitespace** (basic) - GetColorWhitespace method
39. **GetInline** (basic) - GetInline method
40. **GetUnderlineSpaces** (basic) - GetUnderlineSpaces method
41. **GetStrikethroughSpaces** (basic) - GetStrikethroughSpaces method
42. **GetHorizontalFrameSize** (basic) - GetHorizontalFrameSize method
43. **GetVerticalFrameSize** (basic) - GetVerticalFrameSize method
44. **GetFrameSize** (basic) - GetFrameSize method
45. **GetTransform** (basic) - GetTransform method
46. **ColorWhitespace** (basic) - ColorWhitespace method
47. **UnderlineSpaces** (basic) - UnderlineSpaces method
48. **StrikethroughSpaces** (basic) - StrikethroughSpaces method
49. **Renderer** (basic) - Renderer method
50. **StyleRanges** (basic) - StyleRanges method
51. **Inherit** (basic) - Inherits properties from another style
52. **StyleRunes** (basic) - StyleRunes method
53. **SetColorProfile** (color) - SetColorProfile method
54. **HasDarkBackground** (color) - HasDarkBackground method
55. **SetHasDarkBackground** (color) - SetHasDarkBackground method
56. **ColorProfile** (color) - ColorProfile method
57. **Foreground** (color) - Sets foreground color
58. **Background** (color) - Sets background color
59. **UnsetWidth** (layout) - UnsetWidth method
60. **UnsetHeight** (layout) - UnsetHeight method
61. **UnsetAlign** (layout) - UnsetAlign method
62. **UnsetAlignHorizontal** (layout) - UnsetAlignHorizontal method
63. **UnsetAlignVertical** (layout) - UnsetAlignVertical method
64. **UnsetPadding** (layout) - UnsetPadding method
65. **UnsetPaddingLeft** (layout) - UnsetPaddingLeft method
66. **UnsetPaddingRight** (layout) - UnsetPaddingRight method
67. **UnsetPaddingTop** (layout) - UnsetPaddingTop method
68. **UnsetPaddingBottom** (layout) - UnsetPaddingBottom method
69. **UnsetMargins** (layout) - UnsetMargins method
70. **UnsetMarginLeft** (layout) - UnsetMarginLeft method
71. **UnsetMarginRight** (layout) - UnsetMarginRight method
72. **UnsetMarginTop** (layout) - UnsetMarginTop method
73. **UnsetMarginBottom** (layout) - UnsetMarginBottom method
74. **UnsetMarginBackground** (layout) - UnsetMarginBackground method
75. **UnsetMaxWidth** (layout) - UnsetMaxWidth method
76. **UnsetMaxHeight** (layout) - UnsetMaxHeight method
77. **UnsetTabWidth** (layout) - UnsetTabWidth method
78. **GetWidth** (layout) - GetWidth method
79. **GetHeight** (layout) - GetHeight method
80. **GetPadding** (layout) - GetPadding method
81. **GetPaddingTop** (layout) - GetPaddingTop method
82. **GetPaddingRight** (layout) - GetPaddingRight method
83. **GetPaddingBottom** (layout) - GetPaddingBottom method
84. **GetPaddingLeft** (layout) - GetPaddingLeft method
85. **GetHorizontalPadding** (layout) - GetHorizontalPadding method
86. **GetVerticalPadding** (layout) - GetVerticalPadding method
87. **GetMargin** (layout) - GetMargin method
88. **GetMarginTop** (layout) - GetMarginTop method
89. **GetMarginRight** (layout) - GetMarginRight method
90. **GetMarginBottom** (layout) - GetMarginBottom method
91. **GetMarginLeft** (layout) - GetMarginLeft method
92. **GetHorizontalMargins** (layout) - GetHorizontalMargins method
93. **GetVerticalMargins** (layout) - GetVerticalMargins method
94. **GetBorderTopWidth** (layout) - GetBorderTopWidth method
95. **GetMaxWidth** (layout) - GetMaxWidth method
96. **GetMaxHeight** (layout) - GetMaxHeight method
97. **GetTabWidth** (layout) - GetTabWidth method
98. **Width** (layout) - Sets content width
99. **AlignHorizontal** (layout) - AlignHorizontal method
100. **Height** (layout) - Sets content height
101. **AlignVertical** (layout) - AlignVertical method
102. **Padding** (layout) - Sets padding on all sides
103. **PaddingLeft** (layout) - PaddingLeft method
104. **PaddingRight** (layout) - PaddingRight method
105. **PaddingTop** (layout) - PaddingTop method
106. **PaddingBottom** (layout) - PaddingBottom method
107. **Margin** (layout) - Sets margin on all sides
108. **MarginLeft** (layout) - MarginLeft method
109. **MarginRight** (layout) - MarginRight method
110. **MarginTop** (layout) - MarginTop method
111. **MarginBottom** (layout) - MarginBottom method
112. **MarginBackground** (layout) - MarginBackground method
113. **MaxWidth** (layout) - MaxWidth method
114. **MaxHeight** (layout) - MaxHeight method
115. **GetAlign** (layout) - GetAlign method
116. **GetAlignHorizontal** (layout) - GetAlignHorizontal method
117. **GetAlignVertical** (layout) - GetAlignVertical method
118. **Align** (layout) - Sets content alignment
119. **TabWidth** (layout) - TabWidth method
120. **UnsetBorderStyle** (border) - UnsetBorderStyle method
121. **UnsetBorderTop** (border) - UnsetBorderTop method
122. **UnsetBorderRight** (border) - UnsetBorderRight method
123. **UnsetBorderBottom** (border) - UnsetBorderBottom method
124. **UnsetBorderLeft** (border) - UnsetBorderLeft method
125. **UnsetBorderForeground** (border) - UnsetBorderForeground method
126. **UnsetBorderTopForeground** (border) - UnsetBorderTopForeground method
127. **UnsetBorderRightForeground** (border) - UnsetBorderRightForeground method
128. **UnsetBorderBottomForeground** (border) - UnsetBorderBottomForeground method
129. **UnsetBorderLeftForeground** (border) - UnsetBorderLeftForeground method
130. **UnsetBorderBackground** (border) - UnsetBorderBackground method
131. **UnsetBorderTopBackgroundColor** (border) - UnsetBorderTopBackgroundColor method
132. **UnsetBorderTopBackground** (border) - UnsetBorderTopBackground method
133. **UnsetBorderRightBackground** (border) - UnsetBorderRightBackground method
134. **UnsetBorderBottomBackground** (border) - UnsetBorderBottomBackground method
135. **UnsetBorderLeftBackground** (border) - UnsetBorderLeftBackground method
136. **NormalBorder** (border) - NormalBorder method
137. **RoundedBorder** (border) - RoundedBorder method
138. **BlockBorder** (border) - BlockBorder method
139. **OuterHalfBlockBorder** (border) - OuterHalfBlockBorder method
140. **InnerHalfBlockBorder** (border) - InnerHalfBlockBorder method
141. **ThickBorder** (border) - ThickBorder method
142. **DoubleBorder** (border) - DoubleBorder method
143. **HiddenBorder** (border) - HiddenBorder method
144. **MarkdownBorder** (border) - MarkdownBorder method
145. **ASCIIBorder** (border) - ASCIIBorder method
146. **GetBorder** (border) - GetBorder method
147. **GetBorderStyle** (border) - GetBorderStyle method
148. **GetBorderTop** (border) - GetBorderTop method
149. **GetBorderRight** (border) - GetBorderRight method
150. **GetBorderBottom** (border) - GetBorderBottom method
151. **GetBorderLeft** (border) - GetBorderLeft method
152. **GetBorderTopForeground** (border) - GetBorderTopForeground method
153. **GetBorderRightForeground** (border) - GetBorderRightForeground method
154. **GetBorderBottomForeground** (border) - GetBorderBottomForeground method
155. **GetBorderLeftForeground** (border) - GetBorderLeftForeground method
156. **GetBorderTopBackground** (border) - GetBorderTopBackground method
157. **GetBorderRightBackground** (border) - GetBorderRightBackground method
158. **GetBorderBottomBackground** (border) - GetBorderBottomBackground method
159. **GetBorderLeftBackground** (border) - GetBorderLeftBackground method
160. **GetBorderTopSize** (border) - GetBorderTopSize method
161. **GetHorizontalBorderSize** (border) - GetHorizontalBorderSize method
162. **GetVerticalBorderSize** (border) - GetVerticalBorderSize method
163. **BorderStyle** (border) - BorderStyle method
164. **BorderTop** (border) - BorderTop method
165. **BorderRight** (border) - BorderRight method
166. **BorderBottom** (border) - BorderBottom method
167. **BorderLeft** (border) - BorderLeft method
168. **BorderTopForeground** (border) - BorderTopForeground method
169. **BorderRightForeground** (border) - BorderRightForeground method
170. **BorderBottomForeground** (border) - BorderBottomForeground method
171. **BorderLeftForeground** (border) - BorderLeftForeground method
172. **BorderTopBackground** (border) - BorderTopBackground method
173. **BorderRightBackground** (border) - BorderRightBackground method
174. **BorderBottomBackground** (border) - BorderBottomBackground method
175. **BorderLeftBackground** (border) - BorderLeftBackground method
176. **GetBorderLeftSize** (border) - GetBorderLeftSize method
177. **GetBorderBottomSize** (border) - GetBorderBottomSize method
178. **GetBorderRightSize** (border) - GetBorderRightSize method
179. **Border** (border) - Sets border style
180. **BorderForeground** (border) - BorderForeground method
181. **BorderBackground** (border) - BorderBackground method
182. **Bold** (styling) - Sets bold text style
183. **Italic** (styling) - Sets italic text style
184. **Underline** (styling) - Sets underline text style
185. **Strikethrough** (styling) - Strikethrough method
186. **Reverse** (styling) - Reverse method
187. **Blink** (styling) - Blink method
188. **Faint** (styling) - Faint method
189. **Inline** (styling) - Inline method
190. **Transform** (styling) - Transform method
191. **NewFilter** (component) - NewFilter method
192. **NewLeaf** (component) - NewLeaf method
193. **New** (component) - New method
194. **Place** (component) - Place method
195. **DefaultStyles** (component) - DefaultStyles method
196. **Arabic** (component) - Arabic method
197. **Asterisk** (component) - Asterisk method
198. **DefaultEnumerator** (component) - DefaultEnumerator method
199. **RoundedEnumerator** (component) - RoundedEnumerator method
200. **DefaultIndenter** (component) - DefaultIndenter method
201. **PlaceHorizontal** (component) - PlaceHorizontal method
202. **PlaceVertical** (component) - PlaceVertical method
203. **Alphabet** (component) - Alphabet method
204. **Roman** (component) - Roman method
205. **Bullet** (component) - Bullet method
206. **Dash** (component) - Dash method
207. **NewStringData** (component) - NewStringData method
208. **Root** (component) - Root method
209. **JoinVertical** (component) - JoinVertical method
210. **JoinHorizontal** (component) - JoinHorizontal method
