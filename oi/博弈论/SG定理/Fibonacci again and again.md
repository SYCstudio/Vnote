# Fibonacci again and again
[HDU1848]

任何一个大学生对菲波那契数列(Fibonacci numbers)应该都不会陌生，它是这样定义的：  
F(1)=1;  
F(2)=2;  
F(n)=F(n-1)+F(n-2)(n>=3);  
所以，1,2,3,5,8,13……就是菲波那契数列。  
在HDOJ上有不少相关的题目，比如1005 Fibonacci again就是曾经的浙江省赛题。  
今天，又一个关于Fibonacci的题目出现了，它是一个小游戏，定义如下：  
1、  这是一个二人游戏;  
2、  一共有3堆石子，数量分别是m, n, p个；  
3、  两人轮流走;  
4、  每走一步可以选择任意一堆石子，然后取走f个；  
5、  f只能是菲波那契数列中的元素（即每次只能取1，2，3，5，8…等数量）；  
6、  最先取光所有石子的人为胜者；  
假设双方都使用最优策略，请判断先手的人会赢还是后手的人会赢。

由 SG 定理得，所有游戏的 SG 函数等于分别的 SG  函数的异或和，那么求出单个游戏的 SG 值，预处理出 $SG[i]$ 表示石子数为 i 时的 SG 值，然后直接求解。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int inf=2147483647;

int n;
int SG[maxN],Fab[maxN];
bool vis[maxN];

int main(){
	SG[0]=0;Fab[1]=1;Fab[2]=2;
	for (int i=3;i<=20;i++) Fab[i]=Fab[i-1]+Fab[i-2];
	for (int i=1;i<maxN;i++){
		for (int j=1;Fab[j]<=i;j++) vis[SG[i-Fab[j]]]=1;
		int p=0;
		while (vis[p]) p++;
		SG[i]=p;
		for (int j=1;Fab[j]<=i;j++) vis[SG[i-Fab[j]]]=0;
	}
	
	int m,n,p;
	while (scanf("%d%d%d",&m,&n,&p)!=EOF){
		if ((m==0)&&(n==0)&&(p==0)) break;
		if (SG[m]^SG[n]^SG[p]) printf("Fibo\n");
		else printf("Nacci\n");
	}

	return 0;
}
```