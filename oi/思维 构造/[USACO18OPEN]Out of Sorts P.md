# [USACO18OPEN]Out of Sorts P
[BZOJ5277 Luogu4372]

留意着农场之外的长期职业生涯的可能性，奶牛Bessie开始在不同的在线编程网站上学习算法。她最喜欢的两个算法是“冒泡排序”和“快速排序”，但是不幸的是Bessie轻易地把它们搞混了，最后实现了一个奇怪的混合算法！  
如果数组$A$中$A[...i]$的最大值不大于$A[i+1 \ldots]$的最小值，我们就称元素$i$和$i+1$之间的位置为一个“分隔点”。Bessie还记得快速排序包含对数组的重排，产生了一个分隔点，然后要递归对两侧的$A[...i]$和$A[i+1 \ldots]$排序。然而，尽管她正确地记下了数组中所有的分隔点都可以在线性时间内被求出，她却忘记快速排序应该怎么重排来快速构造一个分隔点了！在这个可能会被证明是排序算法的历史中最糟糕的算法性失误之下，她做出了一个不幸的决定，使用冒泡排序来完成这个任务。  
以下是Bessie最初的对数组$A$进行排序的实现的概要。她首先写了一个简单的函数，执行冒泡排序的一轮：  
```
bubble_sort_pass (A) {
   for i = 0 to length(A)-2
      if A[i] < A[i+1], swap A[i] and A[i+1]
}
```
她的快速排序（相当快）函数的递归代码是按下面的样子构成的：  
```
quickish_sort (A) {
   if length(A) = 1, return
   do { // Main loop
      work_counter = work_counter + length(A)
      bubble_sort_pass(A)
   } while (no partition points exist in A) 
   divide A at all partition points; recursively quickish_sort each piece
}
```
Bessie好奇于她的代码能够运行得多快。简单起见，她计算出她得主循环的每一轮都消耗线性时间，所以她相应增加一个全局变量work_counter的值，以此来跟踪整个算法总共完成的工作量。  
给定一个输入数组，请预测quickish_sort函数接收这个数组之后，变量work_counter的最终值。

由于每次是从分割点隔开递归，所以相当于在对整体进行冒泡排序，转化为计算每一个位置上的数冒泡排序的次数。  
一个数不再进入排序，当且仅当它所在的区间只有它自己一个数，即它两边都是分割点。每进行一次冒泡排序，相当于把一个排名在分割点左边但当前在右边的数移动到左边，那么对于分割点 (i,i+1) 来说，记排名在 i 左边但是初始位置在右边的最右边的数位置为 x，因为每一次排序， x 会减一，所以总次数就是 x-i 。那么第 i 个数进入冒泡排序的次数就是两边分割数的较大者。对于每一个数都求出进入冒泡排序的次数，求和即是总计算次数。

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
ll Cnt[maxN];

bool cmp(Data A,Data B);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&D[i].key),D[i].pos=i;
	sort(&D[1],&D[n+1],cmp);
	for (int i=1,mx=0;i<=n;i++){
		mx=max(mx,D[i].pos);
		Cnt[i]=mx-i;
	}
	ll Ans=0;
	for (int i=1;i<=n;i++) Ans=Ans+max(max(Cnt[i-1],Cnt[i]),1ll);
	printf("%lld\n",Ans);return 0;
}

bool cmp(Data A,Data B){
	if (A.key!=B.key) return A.key<B.key;
	return A.pos<B.pos;
}
```