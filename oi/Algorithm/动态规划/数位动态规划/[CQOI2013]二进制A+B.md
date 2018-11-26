# [CQOI2013]二进制A+B
[BZOJ3107 Luogu4574]

输入三个整数$a, b, c$，把它们写成无前导0的二进制整数。  
比如$a=7, b=6, c=9$，写成二进制为$a=111, b=110, c=1001$。  
接下来以位数最多的为基准，其他整数在前面添加前导0，使得$a, b, c$拥有相同的位数。比如在刚才的例子中，添加完前导0后为$a=0111, b=0110, c=1001$。  
最后，把$a, b, c$的各位进行重排，得到a’, b’, c’，使得a’+b’=c’。比如在刚才的例子中，可以这样重排：a’=0111, b’=0011, c’=1010。  
你的任务是让c’最小。如果无解，输出-1。

从低位向高位 DP 。设 F[i][a][b][c][0/1] 表示当前到第 i 位，三个数分别用掉的 1 的个数为 a,b,c ，低位是否有进位，讨论情况转移。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=32;
const int inf=2147483647;
const int meminf=2130706432;

int A,B,C;
int cntA,cntB,cntC,mxw;
int F[maxN][maxN][maxN][maxN][2];

void Min(int &x,int y);

int main(){
	scanf("%d%d%d",&A,&B,&C);
	int mx=max(max(A,B),C);
	while (mx) ++mxw,mx>>=1;
	while (A) cntA+=(A&1),A>>=1;
	while (B) cntB+=(B&1),B>>=1;
	while (C) cntC+=(C&1),C>>=1;
	mem(F,127);
	F[0][0][0][0][0]=0;
	for (int i=0;i<mxw;i++)
		for (int a=0;a<=min(i,cntA);a++)
			for (int b=0;b<=min(i,cntB);b++)
				for (int c=0;c<=min(i,cntC);c++)
					for (int f=0;f<2;f++)
						if (F[i][a][b][c][f]<=meminf){
							int key=F[i][a][b][c][f];
							Min(F[i+1][a][b][c+f][0],key+(f<<i));
							if (a!=cntA){
								if (f==0) Min(F[i+1][a+1][b][c+1][0],key+(1<<i));
								else Min(F[i+1][a+1][b][c][1],key);
							}
							if (b!=cntB){
								if (f==0) Min(F[i+1][a][b+1][c+1][0],key+(1<<i));
								else Min(F[i+1][a][b+1][c][1],key);
							}
							if ((a!=cntA)&&(b!=cntB)){
								if (f==0) Min(F[i+1][a+1][b+1][c][1],key);
								else Min(F[i+1][a+1][b+1][c+1][1],key+(1<<i));
							}
						}
	if (F[mxw][cntA][cntB][cntC][0]>meminf) printf("-1\n");
	else printf("%d\n",F[mxw][cntA][cntB][cntC][0]);
	return 0;
}

void Min(int &x,int y){
	if (y<x) x=y;return;
}
```