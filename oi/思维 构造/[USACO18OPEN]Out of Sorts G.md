# [USACO18OPEN]Out of Sorts G
[BZOJ5278 Luogu4375]

留意着农场之外的长期职业生涯的可能性，奶牛Bessie开始在不同的在线编程网站上学习算法。她到目前为止最喜  欢的算法是“冒泡排序”。这是Bessie最初的对长度为N的数组A进行排序的奶牛码实现。  
```
sorted = false
while (not sorted):
   sorted = true
   moo
   for i = 0 to N-2:
      if A[i+1] < A[i]:
         swap A[i], A[i+1]
         sorted = false
```
显然，奶牛码中的“moo”指令的作用只是输出“moo”。  
奇怪的是，Bessie看上去执着于在她的代码中的不同位置使用这个语句。  
在用若干个数组测试了她的代码之后，Bessie得到一个有趣的观察现象：大的元素很快就会被拉到数组末尾，然而小的元素需要很长时间“冒泡”到数组的开头（她怀疑这就是为什么这个算法得名的原因）。为了实验和缓解这一问题，Bessie试着修改了她的代码，使代码在每次循环中向前再向后各扫描一次，从而无论是大的元素还是小的元素在每一次循环中都有机会被拉较长的一段距离。她的代码现在是这样的：
```
sorted = false
while (not sorted):
   sorted = true
   moo
   for i = 0 to N-2:
      if A[i+1] < A[i]:
         swap A[i], A[i+1]
   for i = N-2 downto 0:
      if A[i+1] < A[i]:
         swap A[i], A[i+1]
   for i = 0 to N-2:
      if A[i+1] < A[i]:
         sorted = false
```
给定一个输入数组，请预测Bessie修改后的代码会输出多少次“moo”。

对于分割点 (i,i+1) ，每次进行交换，会使得左边一个应该在右边的中最大的移动到右边，右边应该在左边的中最小的移动到左边。若记 Ai 表示分割点 i 左边排名大于 i 的数的个数，则每一次双向冒泡排序会使得它减一，所以全局的操作次数就应该是 Ai 的最大值。用树状数组求这个值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int inf=2147483647;

class Data
{
public:
	int key,pos;
};

int n;
Data D[maxN];
int BIT[maxN];

bool cmp(Data A,Data B);
void Add(int pos);
int Query(int pos);

int main(){
	scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&D[i].key),D[i].pos=i;
	sort(&D[1],&D[n+1],cmp);
	int Ans=1;
	for (int i=1;i<=n;i++){
		Add(D[i].pos);Ans=max(Ans,i-Query(i));
	}
	printf("%d\n",Ans);return 0;
}

bool cmp(Data A,Data B){
	if (A.key!=B.key) return A.key<B.key;
	return A.pos<B.pos;
}

void Add(int pos){
	while (pos<=n){
		BIT[pos]++;pos+=(pos)&(-pos);
	}
	return;
}

int Query(int pos){
	int ret=0;
	while (pos){
		ret+=BIT[pos];pos-=(pos)&(-pos);
	}
	return ret;
}
```