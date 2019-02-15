# [SDOI2009]E&D
[BZOJ1228 Luogu2148]

小E 与小W 进行一项名为“E&D”游戏。  
游戏的规则如下： 桌子上有2n 堆石子，编号为1..2n。其中，为了方便起见，我们将第2k-1 堆与第2k 堆 （1 ≤ k ≤ n）视为同一组。第i堆的石子个数用一个正整数Si表示。 一次分割操作指的是，从桌子上任取一堆石子，将其移走。然后分割它同一组的另一堆 石子，从中取出若干个石子放在被移走的位置，组成新的一堆。操作完成后，所有堆的石子 数必须保证大于0。显然，被分割的一堆的石子数至少要为2。 两个人轮流进行分割操作。如果轮到某人进行操作时，所有堆的石子数均为1，则此时 没有石子可以操作，判此人输掉比赛。  
小E 进行第一次分割。他想知道，是否存在某种策 略使得他一定能战胜小W。因此，他求助于小F，也就是你，请你告诉他是否存在必胜策略。 例如，假设初始时桌子上有4 堆石子，数量分别为1,2,3,1。小E可以选择移走第1堆， 然后将第2堆分割（只能分出1 个石子）。接下来，小W 只能选择移走第4 堆，然后将第3 堆分割为1 和2。最后轮到小E，他只能移走后两堆中数量为1 的一堆，将另一堆分割为1 和1。这样，轮到小W 时，所有堆的数量均为1，则他输掉了比赛。故小E 存在必胜策略。

把每一组分开考虑，可以发现 SG 的规律为，若两个均为奇数，则必败=0，否则，把奇数补成偶数后均除以二+1

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int inf=2147483647;

int GetSG(int n,int m);

int main(){
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		int n;scanf("%d",&n);
		int sum=0;
		while (n--){
			int k1,k2;scanf("%d%d",&k1,&k2);
			n--;
			sum^=GetSG(k1,k2);
		}
		if (sum) printf("YES\n");
		else printf("NO\n");
	}
	return 0;
}

int GetSG(int n,int m){
	if ((n&1)&&(m&1)) return 0;
	if (n&1) n++;
	if (m&1) m++;
	return GetSG(n>>1,m>>1)+1;
}
```